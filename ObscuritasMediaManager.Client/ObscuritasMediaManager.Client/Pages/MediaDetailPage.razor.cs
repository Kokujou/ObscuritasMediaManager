using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;
using System;
using System.Linq;
using System.Text.Json;

namespace ObscuritasMediaManager.Client.Pages;

public partial class MediaDetailPage
{
    private List<StreamingEntryModel> StreamingEntries { get; set; } = new();
    private List<Guid> mediaIds { get; set; } = new();
    private MediaModel updatedMedia { get; set; } = new();
    private bool editMode { get; set; }
    private int selectedSeason { get; set; }

    private List<StreamingEntryModel> episodes
                                          => StreamingEntries.Where((x) => x.Season == seasons[selectedSeason]).ToList();

    private List<string> seasons => StreamingEntries.Select(x => x.Season).Distinct().OrderBy(x => x).ToList();

    private int currentMediaId => mediaIds.IndexOf(updatedMedia.Id);

    private Guid nextMediaId => mediaIds.ElementAtOrDefault(currentMediaId + 1);

    private Guid prevMediaId => mediaIds.ElementAtOrDefault(currentMediaId - 1);

    private int release;

    private string releaseString { get => release.ToString(); set => releaseChanged(value).Wait(); }

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();
        mediaIds = Session.mediaList.Current.Select(x => x.Id).ToList();
        Subscriptions.AddRange(
            Session.mediaList
                .Subscribe((x) =>
                        {
                            if (x.newValue is null) return;
                            var currentMedia = x.newValue.FirstOrDefault(x => x.Id == updatedMedia.Id);
                            if (currentMedia is null) return;
                            var filter = JsonSerializer.Deserialize<MediaFilter>(Session.UserSettings.Current.MediaFilter);
                            if (filter is null) return;
                            mediaIds = MediaFilterService.filter(x.newValue, filter).Select((x) => x.Id).ToList();
                        }),
        Session.currentPage.Subscribe(async (_) => await getMediaFromRoute()));

        await getMediaFromRoute();
    }

    private async Task getMediaFromRoute()
    {
        var guidString = NavigationManager.GetQueryParameter("guid");
        if (!Guid.TryParse(guidString, out var guid)) return;
        var media = await MediaRepository.GetAsync(guid);
        updatedMedia = media;
        StreamingEntries = (await StreamingRepository.GetAsync(guid)).ToList();
    }

    private async Task ChangeProperty<T>(Expression<Func<MediaModel, T>> expression, T value)
    {
        await MediaRepository.UpdatePropertyAsync(updatedMedia.Id, expression, value);
        updatedMedia = await MediaRepository.GetAsync(updatedMedia.Id);
    }

    private void releaseInput(string value)
    {
        if (!int.TryParse(value, out var numberValue))
        {
            release = 1900;
            return;
        }
        if ($"{numberValue}" != releaseString) release = numberValue;
    }

    private async Task releaseChanged(string value)
    {
        if (!int.TryParse(value, out var numberValue)) return;
        var maxYears = DateTime.Now.Year + 2;
        if (numberValue < 1900) numberValue = 1900;
        if (numberValue > maxYears) numberValue = maxYears;
        if ($"{numberValue}" != value) value = $"{numberValue}";
        await ChangeProperty(x => x.Release, numberValue);
    }

    private void showGenreSelectionDialog() { }

    private async Task toggleContentWarning(ContentWarning warning)
    {
        if (!updatedMedia.ContentWarnings.Contains(warning))
            await ChangeProperty(x => x.ContentWarnings, updatedMedia.ContentWarnings.Append(warning));

        else
            await ChangeProperty(x => x.ContentWarnings, updatedMedia.ContentWarnings.Except(new[] { warning }));
    }

    private void openVideoPlayer(StreamingEntryModel entry) { }
}
