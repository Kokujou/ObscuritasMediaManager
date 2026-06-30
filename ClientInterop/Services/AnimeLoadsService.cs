using Microsoft.Playwright;
using ObscuritasMediaManager.ClientInterop.Responses;

namespace ObscuritasMediaManager.ClientInterop.Services;

public static class AnimeLoadsService
{
    public static async Task<AutoFilledAnimeResponse> AutoFillAnimeAsync(IBrowserContext browser, bool isMovie,
        string animeName)
    {
        var anime = new AutoFilledAnimeResponse();

        await using var page = await browser.NewPageAsync();
        await Task.Delay(1000);

        var type = !isMovie ? "anime-series" : "anime-movies";
        await page.GotoAsync(
            $"https://www.anime-loads.org/search?type={type}&q=" + animeName.Replace("-", "").Replace(":", ""),
            new()
            {
                WaitUntil = WaitUntilState.DOMContentLoaded
            });

        var firstImagePromise = page.WaitForSelectorAsync(".cover-img", new() { Timeout = 10000 });
        var urlPromise = page.WaitForURLAsync(url => url.Contains("/media/"), new() { Timeout = 10000 });

        await Task.WhenAny(firstImagePromise, urlPromise);
        var firstImageLink = firstImagePromise.IsCompletedSuccessfully ? firstImagePromise.Result : null;

        if (!page.Url.Contains("/media/"))
        {
            if (firstImageLink is null) throw new("Media could not be found on anime-loads.");

            var firstAnimeAddress = await firstImageLink!.EvaluateAsync<string>("link => link.href");
            await page.GotoAsync(firstAnimeAddress);
        }

        anime.RomajiName = await ExtractRomajiNameFromAsync(page);
        anime.KanjiName = await ExtractKanjiNameFromAsync(page);
        anime.GermanName = await ExtractGermanNameFromAsync(page);
        anime.EnglishName = await ExtractEnglishNameFromAsync(page);
        anime.Release = await ExtractReleaseYearFromAsync(page);
        anime.Description = await ExtractDescriptionFromAsync(page);
        anime.Image = await ExtractImageFromAsync(page);

        return anime;
    }

    private static async Task<string?> ExtractImageFromAsync(IPage page)
    {
        var image = await page.QuerySelectorAsync("#description img");
        if (image is null) return null;
        var src = await image.EvaluateAsync<string>("node => node.src");
        if (string.IsNullOrEmpty(src)) return null;
        var imageResponse = await page.GotoAsync(src);
        if (imageResponse is null) return null;
        return Convert.ToBase64String(await imageResponse.BodyAsync());
    }

    private static async Task<int?> ExtractReleaseYearFromAsync(IPage page)
    {
        var releaseYearLink = await page.QuerySelectorAsync("a[href*='/year/']");
        if (releaseYearLink is null) return null;
        return int.Parse(await releaseYearLink.EvaluateAsync<string>("link => link.innerText"));
    }

    private static async Task<string?> ExtractDescriptionFromAsync(IPage page)
    {
        var description = await page.QuerySelectorAsync(".description");
        if (description is null) return null;
        return await description.EvaluateAsync<string>("descr => descr.innerText");
    }

    private static async Task<string?> ExtractRomajiNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-jp) td");
        if (name is null) return null;
        return await name.EvaluateAsync<string>("name => name.firstChild?.textContent?.trim()");
    }

    private static async Task<string?> ExtractKanjiNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-jp) td em");
        if (name is null) return null;
        return await name.EvaluateAsync<string>("name => name.innerText.slice(1,-1)");
    }

    private static async Task<string?> ExtractGermanNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-de) td");
        if (name is null) return null;
        return await name.EvaluateAsync<string>("name => name.innerText");
    }

    private static async Task<string?> ExtractEnglishNameFromAsync(IPage page)
    {
        var name = await page.QuerySelectorAsync("#description tr:has(.flag-en) td");
        if (name is null) return null;
        return await name.EvaluateAsync<string>("name => name.innerText");
    }
}