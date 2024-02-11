
using Concentus.Oggfile;
using Concentus.Structs;
using System.IO;

namespace ObscuritasMediaManager.ClientInterop.Services;

public static class AudioService
{
    public static string TrackPath { get; private set; }

    public static float Volume { get => player.Volume; set => player.Volume = value; }

    public static TimeSpan Position { get => reader?.CurrentTime ?? TimeSpan.Zero; set => SetPosition(value); }

    public static float[] VisualizationData = new float[0];
    public static WaveOutEvent player = new WaveOutEvent();
    private static WaveStream? reader;
    private static AudioVisualizer? visualizer;

    public static void Pause()
    {
        player.Pause();
    }

    public static void Play()
    {
        try
        {
            player.Play();
        }
        catch
        {
            Stop();
            throw;
        }
    }

    public static void Stop()
    {
        player.Stop();
        SetPosition(TimeSpan.Zero);
    }

    public static void ChangeTrack(string trackPath)
    {
        if (trackPath is null) throw new ArgumentNullException(nameof(trackPath));
        Stop();
        player = new WaveOutEvent();
        reader?.Dispose();

        try
        {
            reader = new MediaFoundationReader(trackPath);
        }
        catch
        {
            var fileIn = File.OpenRead(trackPath);
            var pcmStream = new MemoryStream();

            var decoder = OpusDecoder.Create(48000, 1);
            var oggIn = new OpusOggReadStream(decoder, fileIn);
            while (oggIn.HasNextPacket)
            {
                var packet = oggIn.DecodeNextPacket();
                if (packet != null)
                    for (var i = 0; i < packet.Length; i++)
                    {
                        var bytes = BitConverter.GetBytes(packet[i]);
                        pcmStream.Write(bytes, 0, bytes.Length);
                    }
            }
            pcmStream.Position = 0;
            reader = new RawSourceWaveStream(pcmStream, new WaveFormat(48000, 1));
        }

        visualizer = new AudioVisualizer(reader.ToSampleProvider());
        visualizer.Samples.Subscribe(x => VisualizationData = x.newValue ?? new float[0]);
        visualizer.Reset();
        player.Init(visualizer);
        TrackPath = trackPath;
    }

    public static bool Paused()
    {
        return player.PlaybackState != PlaybackState.Playing;
    }

    public static TimeSpan GetCurrentTrackPosition()
    {
        if (reader is null) return TimeSpan.Zero;
        return reader.CurrentTime;
    }

    public static TimeSpan GetCurrentTrackDuration()
    {
        if (reader is null) return TimeSpan.MinValue;
        return reader.TotalTime;
    }

    public static void SetPosition(TimeSpan position)
    {
        if (reader is null) return;
        reader.CurrentTime = position;
    }
}