using NAudio.Wave;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Extensions;

public static class AudioExtensions
{
    public static async Task<object> GetVisualizationData(this WaveOutEvent audio)
    {
        return null;
    }

    public static async Task ChangeTrack(this WaveOutEvent audio, MusicModel track)
    {
        var mainOutputStream = new MediaFoundationReader(track.Path);
        var volumeStream = new WaveChannel32(mainOutputStream);
        audio.Init(volumeStream);
    }

    public static bool Paused(this WaveOutEvent audio)
    {
        return audio.PlaybackState != PlaybackState.Playing;
    }
}
