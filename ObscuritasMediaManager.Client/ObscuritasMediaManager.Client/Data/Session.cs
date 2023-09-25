using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using NAudio.Wave;
using ObscuritasMediaManager.Backend.DataRepositories;
using Serilog;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public class Session(MediaRepository MediaRepository, MusicRepository MusicRepository, UserRepository UserRepository,
    NavigationManager NavigationManager)
{
    public static Observable<string> currentPage { get; set; } = new(string.Empty);
    public static Observable<List<MediaModel>>  mediaList { get; set; } = new(new());
    public static Observable<List<InstrumentModel>> instruments { get; set; } = new(new());
    public static Observable<UserSettingsModel> userSettings { get; set; } = new(new());
    public static WaveOutEvent Audio { get; set; } = new();
    public static bool initialized { get; set; } = false;

    public async Task InitializeAsync()
    {
        initialized = false;

        try
        {
            mediaList.next(await MediaRepository.GetAll().ToListAsync());
        }
        catch (Exception err)
        {
            Log.Error(err.ToString());
        }

        try
        {
            instruments.next((await MusicRepository.GetInstrumentsAsync()).ToList());
        }
        catch (Exception err)
        {
            Log.Error(err.ToString());
        }

        try
        {
            var credentials = await Credentials.FromLocalFileAsync();
            var user = await UserRepository.LogonAsync(credentials.Username, credentials.Password);
            userSettings.next(await UserRepository.GetSettingsAsync(user.Id));
        }
        catch (UnauthorizedAccessException ex)
        {
            Log.Error(ex.ToString());
            NavigationManager.NavigateTo("login");
            return;
        }
        catch (Exception err)
        {
            Log.Error(err.ToString());
        }

        initialized = true;
    }
}
