using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Client.Extensions;
using System;
using System.Text.Json;

namespace ObscuritasMediaManager.Client.Pages;

public partial class MusicPage
{
    private IEnumerable<PlaylistModel> paginatedPlaylists => filteredPlaylists.Take(6 + (3 * currentPage));

    private IEnumerable<MusicModel> paginatedTracks
    {
        get
        {
            var pageSize = (6 + (3 * currentPage)) - filteredPlaylists.Count();
            if (pageSize < 0) pageSize = 0;
            return filteredTracks.Take(pageSize);
        }
    }

    private IEnumerable<PlaylistModel> filteredPlaylists
    {
        get
        {
            var result = MusicFilterService.filterPlaylists(playlists, filter);
            if (sortingProperty is null) return result;
            if ((sortingDirection is null) || (sortingDirection == SortDirection.Ascending))
                return result.OrderBy(x => sortingProperty(x));
            return result.OrderByDescending(x => sortingProperty(x));
        }
    }

    private IEnumerable<MusicModel> filteredTracks
    {
        get
        {
            var result = MusicFilterService.filterTracks(musicTracks, filter);
            if (sortingProperty is null) return result;
            if ((sortingDirection is null) || (sortingDirection == SortDirection.Ascending)) 
                return result.OrderBy(x => sortingProperty(x));
            return result.OrderByDescending(x => sortingProperty(x));
        }
    }

    private MusicModel? currentTrack { get; set; }
    private MusicFilterOptions filter { get; set; }
    private List<MusicModel> musicTracks { get; set; } = new();
    private List<PlaylistModel> playlists { get; set; } = new();
    private List<string> selectedHashes { get; set; } = new();
    private int currentPage { get; set; } = 10;
    private SortDirection? sortingDirection { get; set; } = SortDirection.Ascending;
    private Func<object, object>? sortingProperty { get; set; }
    private bool loading { get; set; } = true;
    private bool selectionMode { get; set; } = false;
    private CancellationTokenSource selectionCancellation { get; set; } = new();

    public async Task UpdateFilterAsync(MusicFilterOptions filter)
    {
        this.filter = filter;

        var currentSettings = Session.userSettings.current();
        if (currentSettings is null) return;

        currentSettings.MusicFilter = JsonSerializer.Serialize(filter);
        await UserRepository.UpdateUserSettingsAsync(currentSettings);
        Session.userSettings.next(await UserRepository.GetSettingsAsync(currentSettings.Id));
    }

    public async Task importFolder() { }

    public async Task cleanupTracks() { }

    public async Task showPlaylistSelectionDialog() { }

    public async Task showCreatePlaylistDialog() { }

    public void changeVolume(int value) { }

    public void jumpToActive() { }

    public void loadNext() { }

    public async Task exportPlaylist(string mode, PlaylistModel playlist) { }

    public async Task removePlaylist(PlaylistModel playlist) { }

    public void PlaySelected() { }

    public async Task softDeleteTrack(MusicModel track) { }

    public async Task hardDeleteTrack(MusicModel track) { }

    public async Task undeleteTrack(MusicModel track) { }

    public async Task toggleMusic(MusicModel track) { }

    public async Task startSelectionModeTimer(string trackHash)
    {
        await Task.Delay(500, selectionCancellation.Token);
        selectionMode = true;
        selectedHashes.Add(trackHash);
    }

    public void stopSelectionModeTimer(string trackHash)
    {
        selectionCancellation.Cancel();
    }

    public void selectTrack(string hash)
    {
        if (!selectedHashes.Contains(hash))
            selectedHashes.Add(hash);
        else
            selectedHashes.Remove(hash);

        if (selectedHashes.Count == 0) selectionMode = false;
    }

    public async Task initializeData()
    {
        loading = true;

        try
        {
            playlists = await PlaylistRepository.GetAll().ToListAsync();
            musicTracks = await MusicRepository.GetAll().ToListAsync();
        }
        catch (Exception err)
        {
            Log.Error(err.ToString());
        }

        loading = false;
    }

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();

        filter = new(Session.instruments.current()?.Select(x => x.Name) ?? new List<string>());

        Subscriptions.AddRange(Session.userSettings
                .subscribe((data) =>
                        {
                            if (data.newValue is null) return;
                            changeVolume(data.newValue.Volume);
                            filter = JsonSerializer.Deserialize<MusicFilterOptions>(
                                            data.newValue.MusicFilter ?? string.Empty) ??
                                new(new List<string>());
                        }));

        await initializeData();
    }
}