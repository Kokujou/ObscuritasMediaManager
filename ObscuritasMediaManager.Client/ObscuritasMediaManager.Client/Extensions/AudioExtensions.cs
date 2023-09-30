using NAudio.Wave;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Extensions;

public static class AudioExtensions
{
    public static async Task ChangeTrackAsync(this Session session, MusicModel track)
    {
        session.Audio.Stop();
        session.AudioReader?.Dispose();
        session.AudioReader = new MediaFoundationReader(track.Path);
        var volumeStream = new WaveChannel32(session.AudioReader);
        session.Audio.Init(volumeStream);
    }

    public static bool Paused(this WaveOutEvent audio)
    {
        return audio.PlaybackState != PlaybackState.Playing;
    }

    public static TimeSpan GetCurrentTrackPosition(this Session session)
    {
        if (session.AudioReader is null) return TimeSpan.Zero;
        return session.AudioReader.CurrentTime;
    }

    public static TimeSpan GetCurrentTrackDuration(this Session session)
    {
        if (session.AudioReader is null) return TimeSpan.MinValue;
        return session.AudioReader.TotalTime;
    }
}
