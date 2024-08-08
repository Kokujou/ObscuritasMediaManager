using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;
using PuppeteerSharp;

namespace ObscuritasMediaManager.Backend.Services;

public class AnimeLoadsService(DatabaseContext context)
{
    private static async Task<string?> ExtractImageFromAsync(IPage page)
    {
        var image = await page.QuerySelectorAsync("#description img");
        if (image is null) return null;
        var src = await image.EvaluateFunctionAsync<string>("node => node.src");
        if (src is null) return null;
        var imageResponse = await page.GoToAsync(src);
        return Convert.ToBase64String(await imageResponse.BufferAsync());
    }

    private static async Task<int?> ExtractReleaseYearFromAsync(IPage page)
    {
        var releaseYearLink = await page.QuerySelectorAsync("a[href*='/year/']");
        if (releaseYearLink is null) return null;
        return int.Parse(await releaseYearLink.EvaluateFunctionAsync<string>("link => link.innerText"));
    }

    private static async Task<string?> ExtractDescriptionFromAsync(IPage page)
    {
        var description = await page.QuerySelectorAsync(".description");
        if (description is null) return null;
        return await description.EvaluateFunctionAsync<string>("descr => descr.innerText");
    }

    private static async Task<string?> ExtractRomajiNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-jp) td");
        if (name is null) return null;
        return await name.EvaluateFunctionAsync<string>("name => name.firstChild?.textContent?.trim()");
    }

    private static async Task<string?> ExtractKanjiNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-jp) td em");
        if (name is null) return null;
        return await name.EvaluateFunctionAsync<string>("name => name.innerText.slice(1,-1)");
    }

    private static async Task<string?> ExtractGermanNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-de) td");
        if (name is null) return null;
        return await name.EvaluateFunctionAsync<string>("name => name.innerText");
    }

    private static async Task<string?> ExtractEnglishNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-en) td");
        if (name is null) return null;
        return await name.EvaluateFunctionAsync<string>("name => name.innerText");
    }

    public async Task<MediaModel> AutoFillAnimeAsync(MediaModel anime)
    {
        if (anime.Type is not MediaCategory.AnimeMovies and not MediaCategory.AnimeSeries)
            throw new("Media type is not supported");
        if (anime is { Image.Length: > 5, Release: > 1900, Description.Length: > 5 })
            throw new("Anime is already complete");

        await using var browser =
            await Puppeteer.ConnectAsync(new() { BrowserURL = "http://localhost:8083", SlowMo = 10 });

        await using var page = (await browser.PagesAsync()).First();

        try
        {
            await page.GoToAsync("https://www.anime-loads.org/search?q=" + anime.Name, 0);
            var content = await page.GetContentAsync();
            if (!page.Url.Contains("/media/"))
            {
                var firstImageLink = await page.QuerySelectorAsync(".cover-img") ??
                                     throw new("Media could not be found on anime-loads.");
                var firstAnimeAddress = await firstImageLink.EvaluateFunctionAsync<string>("link => link.href");
                await page.GoToAsync(firstAnimeAddress);
            }

            anime.Name = await ExtractRomajiNameFromAsync(page) ?? anime.Name;
            anime.KanjiName = await ExtractKanjiNameFromAsync(page) ?? anime.KanjiName;
            anime.GermanName = await ExtractGermanNameFromAsync(page) ?? anime.GermanName;
            anime.EnglishName = await ExtractEnglishNameFromAsync(page) ?? anime.EnglishName;
            if (anime is not { Release: > 1900 })
                anime.Release = await ExtractReleaseYearFromAsync(page) ?? anime.Release;
            if (anime.Description is not { Length: > 5 })
                anime.Description = await ExtractDescriptionFromAsync(page) ?? anime.Description;
            if (anime.Image is not { Length: > 5 }) anime.Image = await ExtractImageFromAsync(page) ?? anime.Image;
            await context.SaveChangesAsync();
            Log.Warning($"media {anime.Name} was successfully updated.");
            return anime;
        }
        catch (Exception ex)
        {
            Log.Error(ex, $"An error happened when updating media {anime.Name}");
            throw;
        }
        finally
        {
            await browser.CloseAsync();
        }
    }
}