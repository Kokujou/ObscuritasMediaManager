using Microsoft.AspNetCore.Components;
using NAudio.Utils;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Client.Extensions;
using ObscuritasMediaManager.Client.GenericComponents;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Pages;

public partial class MusicPlaylistPage
{
    public bool SwitchSecondMood { get; set; }

    private IEnumerable<MusicGenre> autocompleteGenres
                                        => Enum.GetValues<MusicGenre>()
                                            .Where((genre) => !updatedTrack.Genres.Any((x) => x == genre));

    private string currentTrackPositionText
    {
        get
        {
            var position = Session.Audio.GetPositionTimeSpan();
            return $"{position.Minutes.ToString().PadLeft(2, '0')}:${ position.Seconds.ToString().PadLeft(2, '0')}";
        }
    }

    private PlaylistModel playlist { get; set; } = new() { Tracks = new List<MusicModel>() };
    private int currentTrackIndex { get; set; } = -1;
    private MusicModel currentTrack { get; set; } = new MusicModel();
    private MusicModel updatedTrack { get; set; } = new MusicModel();
    private int hoveredRating { get; set; } = -1;

    private Mood SecondaryMood => (updatedTrack.Mood2 == Mood.Unset) ? updatedTrack.Mood1 : updatedTrack.Mood2;

    public override void Dispose()
    {
        base.Dispose();
        Session.Audio.Stop();
    }

    public async Task changeTrackBy(int offset)
    {
        var index = currentTrackIndex + offset;
        if (index < 0) index = playlist.Tracks.Count() - 1;
        if (index >= playlist.Tracks.Count()) index = 0;
        await changeTrack(index);
    }

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();

        Subscriptions.AddRange(Session.UserSettings
                .Subscribe(async (data) =>
                        {
                            if (data.newValue is null) return;
                            await changeVolume(data.newValue.Volume, false);
                        }));

        await initializeData();
    }

    private async Task initializeData()
    {
        var playlistIdString = NavigationManager.GetQueryParameter("guid");
        var trackId = NavigationManager.GetQueryParameter("track");

        if (!Guid.TryParse(playlistIdString, out var playlistId))
        {
            currentTrackIndex = 0;
            currentTrack = await MusicRepository.GetAsync(trackId);
            playlist = new PlaylistModel
                       {
                           Tracks = new List<MusicModel> { currentTrack },
                           IsTemporary = true,
                           Genres = new List<MusicGenre>()
                       };
        }
        else
        {
            playlist = await PlaylistRepository.GetPlaylistAsync(playlistId);
            if (int.TryParse(trackId ?? "0", out var trackIndex)) currentTrackIndex = trackIndex;
        }

        updatedTrack = playlist.Tracks.ElementAt(currentTrackIndex);
        await Session.ChangeTrackAsync(currentTrack);
        StateHasChanged();
    }

    private async Task toggleCurrentTrack()
    {
        try
        {
            if (Session.Audio.Paused())
                Session.Audio.Play();
            else
                Session.Audio.Pause();
        }
        catch
        {
            await changeTrackBy(1);
        }

        StateHasChanged();
    }

    private async Task changeTrack(int index)
    {
        if (playlist.Tracks.Count() == 1) return;
        Session.Audio.Pause();
        currentTrackIndex = index;
        updatedTrack = playlist.Tracks.ElementAt(currentTrackIndex);

        var query = $"?guid={playlist.Id}&track ={currentTrackIndex}";
        var absoluteUri = NavigationManager.ToAbsoluteUri(NavigationManager.Uri);
        NavigationManager.NavigateTo(absoluteUri.GetLeftPart(UriPartial.Path));

        await Session.ChangeTrackAsync(currentTrack);
        Session.Audio.Play();
        StateHasChanged();
    }

    private async Task changeVolume(int volume, bool saveSettings)
    {
        Session.Audio.Volume = volume / 100f;
        if (!saveSettings) return;
        await UserRepository.UpdateUserSettingsAsync(Session.UserSettings.Current.Id, x => x.SetProperty(y => y.Volume, volume));
    }

    private async Task changeProperty<T>(Func<MusicModel, T> property, T value)
    {
        try
        {
            await MusicRepository.UpdateAsync(updatedTrack.Hash, x => x.SetProperty(property, value));
            updatedTrack = await MusicRepository.GetAsync(updatedTrack.Hash);
        }
        catch (Exception ex)
        {
            MessageSnackbar.Popup($"Ein Fehler ist beim update des Nutzers aufgetreten: {ex}", MessageSnackbar.Type.Error);
        }
    }

    private void randomize()
    {
        playlist.Tracks = playlist.Tracks.Randomize();
        currentTrackIndex = 0;
        StateHasChanged();
    }

    private async Task showLyrics() { }

    private async Task showLanguageSwitcher() { }

    private async Task openInstrumentsDialog() { }

    private async Task changeCurrentTrackPath() { }

    private async Task openEditPlaylistDialog() { }
}
