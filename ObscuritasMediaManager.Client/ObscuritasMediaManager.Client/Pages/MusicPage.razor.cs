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
            if (filter?.MusicSortProperty is null) return result;
            if ((filter?.SortDirection is null) || (filter.SortDirection == SortDirection.Ascending))
                return result.OrderBy(x => filter.MusicSortProperty(x.ToMusicForDisplay()));
            return result.OrderByDescending(x => filter.MusicSortProperty(x.ToMusicForDisplay()));
        }
    }

    private IEnumerable<MusicModel> filteredTracks
    {
        get
        {
            var result = MusicFilterService.filterTracks(musicTracks, filter);
            if (filter?.MusicSortProperty is null) return result;
            if ((filter?.SortDirection is null) || (filter.SortDirection == SortDirection.Ascending)) 
                return result.OrderBy(x => filter.MusicSortProperty(x));
            return result.OrderByDescending(x => filter.MusicSortProperty(x));
        }
    }

    private MusicModel? currentTrack { get; set; }
    private MusicFilterOptions filter { get; set; }
    private List<MusicModel> musicTracks { get; set; } = new();
    private List<PlaylistModel> playlists { get; set; } = new();
    private List<string> selectedHashes { get; set; } = new();
    private int currentPage { get; set; } = 10;
    private bool loading { get; set; } = true;
    private bool selectionMode { get; set; } = false;
    private CancellationTokenSource selectionCancellation { get; set; } = new();

    public async Task UpdateFilterAsync(MusicFilterOptions filter)
    {
        this.filter = filter;

        var currentSettings = Session.UserSettings.Current;
        if (currentSettings is null) return;

        var filterString = JsonSerializer.Serialize(filter);
        await UserRepository.UpdateUserSettingsAsync(x => x.SetProperty(x => x.MusicFilter, filterString));
        Session.UserSettings.Next(await UserRepository.GetSettingsAsync(currentSettings.Id));
    }

    public async Task importFolder() { }

    public async Task cleanupTracks() { }

    public async Task showPlaylistSelectionDialog() { }

    public async Task showCreatePlaylistDialog() { }

    public async Task changeVolume(int value, bool onDb)
    {
        Session.Audio.Volume = value / 100f;

        if (!onDb) return;
        await UserRepository.UpdateUserSettingsAsync(x => x.SetProperty(x => x.Volume, value));
        Session.UserSettings.Next(await UserRepository.GetSettingsAsync(Session.UserSettings.Current.Id));
    }

    public void jumpToActive() { }

    public void loadNext() { }

    public async Task exportPlaylist(string mode, PlaylistModel playlist) { }

    public async Task removePlaylist(PlaylistModel playlist) { }

    public void PlaySelected() { }

    public async Task softDeleteTrack(MusicModel track) { }

    public async Task hardDeleteTrack(MusicModel track) { }

    public async Task undeleteTrack(MusicModel track) { }

    public async Task toggleMusic(MusicModel track)
    {
        if (selectionMode) return;
        if (currentTrack?.Hash != track.Hash)
        {
            currentTrack = track;
            await Session.Audio.ChangeTrack(track);
        }

        if (!Session.Audio.Paused())
            Session.Audio.Pause();
        else if (Session.Audio.Paused()) Session.Audio.Play();
    }

    public async Task startSelectionModeTimer(string trackHash)
    {
        await Task.Delay(500, selectionCancellation.Token);
        selectionMode = true;
        selectedHashes.Add(trackHash);
    }

    public void stopSelectionModeTimer()
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

        filter = new(Session.instruments.Current?.Select(x => x.Name) ?? new List<string>());

        Subscriptions.AddRange(Session.UserSettings
                .Subscribe(async (data) =>
                        {
                            if (data.newValue is null) return;
                            await changeVolume(data.newValue.Volume, false);
                            try
                            {
                                filter = JsonSerializer.Deserialize<MusicFilterOptions>(data.newValue.MusicFilter)!;
                            }
                            catch { }
                            filter ??= new(new List<string>());
                        }));
        await initializeData();
    }
}