using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.DataRepositories;
using PuppeteerSharp;

namespace ObscuritasMediaManager.Backend.Services;

public class AnimeLoadsService(IServiceProvider provider)
{
    public async Task FillAnimesAsync()
    {
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        await using var browser =
            await Puppeteer.ConnectAsync(new() { BrowserURL = "http://localhost:8083", SlowMo = 10 });
        await using var page = (await browser.PagesAsync()).First();
        var mediaList =
            await context.Media.AsTracking()
                .Where(x => x.Type == MediaCategory.AnimeSeries || x.Type == MediaCategory.AnimeMovies)
                .Where(media => media.Image == null || media.Image.Length < 5 || media.Release <= 1900 ||
                                (media.Description == null && media.Description.Length < 5))
                .ToListAsync();
        foreach (var media in mediaList.Where(x => x.Release <= 1900))
        {
            if (media.Image?.Length > 5 && media.Release > 1900 && media.Description?.Length > 5) continue;
            try
            {
                await page.GoToAsync("https://www.anime-loads.org/search?q=" + media.Name, 0);
                if (!page.Url.Contains("/media/"))
                {
                    var firstImageLink = await page.QuerySelectorAsync(".cover-img");
                    if (firstImageLink is null) continue;
                    var firstAnimeAddress = await firstImageLink.EvaluateFunctionAsync<string>("link => link.href");

                    await page.GoToAsync(firstAnimeAddress);
                }

                if (media is not { Release: > 1900 }) media.Release = await ExtractReleaseYearFromAsync(page);
                if (media.Description is not { Length: > 5 })
                    media.Description = await ExtractDescriptionFromAsync(page);
                if (media.Image is not { Length: > 5 }) media.Image = await ExtractImageFromAsync(page);
                await context.SaveChangesAsync();
                Log.Warning($"media {media.Name} was successfully updated.");
            }
            catch (Exception ex)
            {
                Log.Error(ex, $"An error happened when updating media {media.Name}");
            }
        }
    }

    private static async Task<string> ExtractImageFromAsync(IPage page)
    {
        var image = await page.QuerySelectorAsync("#description img");
        var src = await image.EvaluateFunctionAsync<string>("node => node.src");
        var imageResponse = await page.GoToAsync(src);
        return Convert.ToBase64String(await imageResponse.BufferAsync());
    }

    private static async Task<int> ExtractReleaseYearFromAsync(IPage page)
    {
        var releaseYearLink = await page.QuerySelectorAsync("a[href*='/year/']");
        return int.Parse(await releaseYearLink.EvaluateFunctionAsync<string>("link => link.innerText"));
    }

    private static async Task<string> ExtractDescriptionFromAsync(IPage page)
    {
        var description = await page.QuerySelectorAsync(".description");
        return await description.EvaluateFunctionAsync<string>("descr => descr.innerText");
    }
}