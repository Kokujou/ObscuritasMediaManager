using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Client.Dialogs;
using ObscuritasMediaManager.Client.GenericComponents;
using System;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Client.Pages;

public partial class MusicPlaylistPage
{
    private static OpenFileDialog AudioBrowser = new() { Filter = FileDialogConstants.AudioFilter };

    [Parameter]
    [SupplyParameterFromQuery]
    public Guid? PlaylistId { get; set; }
    [Parameter]
    [SupplyParameterFromQuery]
    public string? TrackHash { get; set; }
    [Parameter]
    [SupplyParameterFromQuery]
    public int? TrackIndex { get; set; }
    [Parameter]
    [SupplyParameterFromQuery]
    public bool CreateNew { get; set; }
    public bool SwitchSecondMood { get; set; }

    private IEnumerable<MusicGenre> autocompleteGenres
                                        => Enum.GetValues<MusicGenre>()
                                            .Where((genre) => !updatedTrack.Genres.Any((x) => x == genre));

    private PlaylistModel playlist { get; set; } = new() { Tracks = new List<MusicModel>() };
    private int currentTrackIndex { get; set; } = -1;
    private MusicModel updatedTrack { get; set; } = new MusicModel();
    private int hoveredRating { get; set; } = -1;

    private Mood SecondaryMood => (updatedTrack.Mood2 == Mood.Unset) ? updatedTrack.Mood1 : updatedTrack.Mood2;

    public override void Dispose()
    {
        base.Dispose();
        Audio.Stop();
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

        Subscriptions.AddRange(
            Session.UserSettings
                .Subscribe(
                    async (data) =>
                    {
                        if (data.newValue is null) return;
                        await changeVolume(data.newValue.Volume, false);
                    }));

        await initializeData();
    }

    private async Task initializeData()
    {
        if (CreateNew)
        {
            currentTrackIndex = 0;
            playlist = new PlaylistModel
                       {
                           Tracks = new List<MusicModel> { new() },
                           IsTemporary = true,
                           Genres = new List<MusicGenre>()
                       };
        }
        else if ((PlaylistId is null) || (PlaylistId == Guid.Empty))
        {
            currentTrackIndex = 0;
            playlist = new PlaylistModel
                       {
                           Tracks = new List<MusicModel> { await MusicRepository.GetAsync(TrackHash) },
                           IsTemporary = true,
                           Genres = new List<MusicGenre>()
                       };
        }
        else
        {
            playlist = await PlaylistRepository.GetPlaylistAsync(PlaylistId.Value);
            currentTrackIndex = TrackIndex ?? 0;
        }

        updatedTrack = playlist.Tracks.ElementAt(currentTrackIndex);
        await Audio.ChangeTrackAsync(updatedTrack);
        StateHasChanged();
    }

    private async Task toggleCurrentTrack()
    {
        try
        {
            if (Audio.Paused())
                Audio.Play();
            else
                Audio.Pause();
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
        Audio.Pause();
        currentTrackIndex = index;
        updatedTrack = playlist.Tracks.ElementAt(currentTrackIndex);

        var query = $"?guid={playlist.Id}&track={currentTrackIndex}";
        var absoluteUri = NavigationManager.ToAbsoluteUri(NavigationManager.Uri);
        NavigationManager.NavigateTo(absoluteUri.GetLeftPart(UriPartial.Path));

        await Audio.ChangeTrackAsync(updatedTrack);
        Audio.Play();
        StateHasChanged();
    }

    private async Task changeVolume(int volume, bool saveSettings)
    {
        Audio.Volume = volume / 100f;
        if (!saveSettings) return;
        await UserRepository.UpdateUserSettingsAsync(Session.UserSettings.Current.Id, x => x.SetProperty(y => y.Volume, volume));
    }

    private async Task ChangePropertyAsync<T>(Expression<Func<MusicModel, T>> property, T value)
    {
        try
        {
            property.SetPropertyValue(updatedTrack, value);
            if (CreateNew) return;
            await MusicRepository.UpdatePropertyAsync(updatedTrack.Hash, property, value);
        }
        catch (Exception ex)
        {
            MessageSnackbar.Popup($"Ein Fehler ist beim Update des Tracks aufgetreten: {ex}", MessageSnackbar.Type.Error);
        }
    }

    private async Task CreateTrackAsync()
    {
        try
        {
            if (!File.Exists(updatedTrack.Path))
                throw new FileNotFoundException("Der Track-Pfad existiert nicht.", updatedTrack.Path);
            if (!(await FFmpeg.GetMediaInfo(updatedTrack.Path)).AudioStreams.Any())
                throw new ArgumentException("Der angegebene Track-Pfad ist keine valide Audio-Datei");
            updatedTrack.CalculateHash();
            await MusicRepository.CreateTrackAsync(updatedTrack);
            MessageSnackbar.Popup($"Der Track wurde erfolgreich erstellt", MessageSnackbar.Type.Success);
            NavigationManager.NavigateToComponent<MusicPlaylistPage>(
                new() { { nameof(MusicPlaylistPage.TrackHash), updatedTrack.Hash } });
        }
        catch (Exception ex)
        {
            MessageSnackbar.Popup(
                $"Ein Fehler ist beim Erstellen des Tracks aufgetreten: {ex.Message}", MessageSnackbar.Type.Error);
        }
    }

    private void randomize()
    {
        playlist.Tracks = playlist.Tracks.Randomize();
        currentTrackIndex = 0;
        StateHasChanged();
    }

    private async Task StartShowingLyricsAsync()
    {
        try
        {
            var offset = -1;
            LyricsDialog? dialog = null;
            if (updatedTrack.Lyrics?.Length > 0)
                dialog = await LyricsDialog.StartShowingAsync(updatedTrack.DisplayName, updatedTrack.Lyrics, false);
            else
            {
                offset = 0;
                var lyrics = await LyricsService.SearchForLyricsAsync(updatedTrack);
                dialog = await LyricsDialog.StartShowingAsync(lyrics.Title, lyrics.Text, true);
            }

            if (dialog is null) return;

            dialog.OnSave = EventCallback.Factory
                .Create(this, async () => await ChangePropertyAsync(x => x.Lyrics, dialog.Lyrics));

            dialog.RequestLyrics = EventCallback.Factory
                .Create(
                    this, async () =>
                    {
                        offset++;
                        try
                        {
                            var newLyrics = await LyricsService.SearchForLyricsAsync(updatedTrack, offset);
                            await dialog.UpdateLyricsAsync(newLyrics.Title, newLyrics.Text);
                        }
                        catch
                        {
                            dialog.CanNext = false;
                        }
                    });
        }
        catch
        {
            MessageSnackbar.Popup("Es konnten leider keine passenden Lyrics gefunden werden.", MessageSnackbar.Type.Error);
        }
    }

    private async Task showLanguageSwitcher() { }

    private async Task openInstrumentsDialog()
    {
        var GroupInstruments = (IEnumerable<InstrumentModel> x) => x.GroupBy(x => x.Type.ToString(), x => x.Name).ToDictionary();

        await GroupedSelectionDialog.ShowAsync(
            "Instrumente auswählen", GroupInstruments(Session.instruments.Current), GroupInstruments(updatedTrack.Instruments),
            true, true);
    }

    private async Task changeCurrentTrackPath()
    {
        try
        {
            var result = await AudioBrowser.ShowDialogAsync();
            if (result != DialogResult.OK) return;
            await ChangePropertyAsync(x => x.Path, AudioBrowser.FileName);
            await Audio.ChangeTrackAsync(updatedTrack);
        }
        catch (OperationCanceledException) { }
        catch (AggregateException agg) when (agg.InnerException is OperationCanceledException) { }
        catch (Exception ex)
        {
            MessageSnackbar.Popup(
                $"Ein Fehler ist beim ändern des Track-Pfades aufgetreten: {ex.Message}", MessageSnackbar.Type.Error);
        }
    }

    private async Task openEditPlaylistDialog() { }
}
