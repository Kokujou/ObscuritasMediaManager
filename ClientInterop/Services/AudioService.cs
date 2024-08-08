using Concentus;
using Concentus.Oggfile;
using System.IO;

namespace ObscuritasMediaManager.ClientInterop.Services;

public static class AudioService
{
    public static string? TrackPath { get; private set; }

    public static float Volume { get => Player.Volume; set => Player.Volume = value; }

    public static TimeSpan Position { get => Reader?.CurrentTime ?? TimeSpan.Zero; set => SetPosition(value); }

    public static float[] VisualizationData = [];
    public static WaveOutEvent Player = new();
    private static WaveStream? Reader;
    private static AudioVisualizer? Visualizer;

    public static void Pause()
    {
        Player.Pause();
    }

    public static void Play()
    {
        try
        {
            Player.Play();
        }
        catch
        {
            Stop();
            throw;
        }
    }

    public static void Stop()
    {
        Player.Stop();
        SetPosition(TimeSpan.Zero);
    }

    public static void ChangeTrack(string trackPath)
    {
        if (trackPath is null)
        {
            throw new ArgumentNullException(nameof(trackPath));
        }

        Stop();
        Player = new();
        Reader?.Dispose();

        try
        {
            Reader = new MediaFoundationReader(trackPath);
        }
        catch
        {
            var fileIn = File.OpenRead(trackPath);
            var pcmStream = new MemoryStream();

            var decoder = OpusCodecFactory.CreateDecoder(48000, 1);
            var oggIn = new OpusOggReadStream(decoder, fileIn);
            while (oggIn.HasNextPacket)
            {
                var packet = oggIn.DecodeNextPacket();
                if (packet != null)
                {
                    for (var i = 0; i < packet.Length; i++)
                    {
                        var bytes = BitConverter.GetBytes(packet[i]);
                        pcmStream.Write(bytes, 0, bytes.Length);
                    }
                }
            }

            pcmStream.Position = 0;
            Reader = new RawSourceWaveStream(pcmStream, new(48000, 1));
        }

        Visualizer = new(Reader.ToSampleProvider());
        Visualizer.Samples.Subscribe(x => VisualizationData = x.newValue ?? new float[0]);
        Visualizer.Reset();
        Player.Init(Visualizer);
        TrackPath = trackPath;
    }

    public static bool Paused()
    {
        return Player.PlaybackState != PlaybackState.Playing;
    }

    public static TimeSpan GetCurrentTrackPosition()
    {
        if (Reader is null)
        {
            return TimeSpan.Zero;
        }

        return Reader.CurrentTime;
    }

    public static TimeSpan GetCurrentTrackDuration()
    {
        if (Reader is null)
        {
            return TimeSpan.MinValue;
        }

        return Reader.TotalTime;
    }

    public static void SetPosition(TimeSpan position)
    {
        if (Reader is null)
        {
            return;
        }

        Reader.CurrentTime = position;
    }
}