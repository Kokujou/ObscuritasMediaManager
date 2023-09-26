using Microsoft.EntityFrameworkCore;
using NAudio.Wave;
using ObscuritasMediaManager.Backend.DataRepositories;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public class Session(MediaRepository MediaRepository, MusicRepository MusicRepository, UserRepository UserRepository)
{
    public  Observable<string> currentPage { get; set; } = new(string.Empty);
    public  Observable<List<MediaModel>>  mediaList { get; set; } = new(new());
    public  Observable<List<InstrumentModel>> instruments { get; set; } = new(new());
    public  Observable<UserSettingsModel> UserSettings { get; set; } = new(new());
    public  WaveOutEvent Audio { get; set; } = new();
    public  bool initialized { get; set; } = false;

    public async Task InitializeAsync()
    {
        initialized = false;

        try
        {
            mediaList.Next(await MediaRepository.GetAll().ToListAsync());
        }
        catch (Exception err)
        {
            Log.Error(err.ToString());
        }

        try
        {
            instruments.Next((await MusicRepository.GetInstrumentsAsync()).ToList());
        }
        catch (Exception err)
        {
            Log.Error(err.ToString());
        }

        try
        {
            var credentials = await Credentials.FromLocalFileAsync();
            var user = await UserRepository.LogonAsync(credentials.Username, credentials.Password);
            UserSettings.Next(await UserRepository.GetSettingsAsync(user.Id));
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (Exception err)
        {
            Log.Error(err.ToString());
        }

        initialized = true;
    }
}
