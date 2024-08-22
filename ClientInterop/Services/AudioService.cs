using Concentus;
using Concentus.Oggfile;
using ObscuritasMediaManager.ClientInterop.Events;
using System.IO;

namespace ObscuritasMediaManager.ClientInterop.Services;

public static class AudioService
{
    public static WebSocketInterop? Interop { get; set; }
    public static string? TrackPath { get; private set; }

    public static float Volume
    {
        get => Player.Volume;
        set => Player.Volume = value;
    }

    public static float[] VisualizationData { get; private set; } = [];
    public static WaveOutEvent Player { get; private set; } = new();
    private static WaveStream? _reader;
    private static AudioVisualizer? _visualizer;

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
        ArgumentNullException.ThrowIfNull(trackPath);

        Stop();
        Player = new();
        _reader?.Dispose();

        try
        {
            _reader = new MediaFoundationReader(trackPath);
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
                if (packet == null)
                    continue;

                foreach (var t in packet)
                {
                    var bytes = BitConverter.GetBytes(t);
                    pcmStream.Write(bytes, 0, bytes.Length);
                }
            }

            pcmStream.Position = 0;
            _reader = new RawSourceWaveStream(pcmStream, new(48000, 1));
        }

        _visualizer = new(_reader.ToSampleProvider());
        _visualizer.Samples.Subscribe(x => VisualizationData = x.newValue ?? []);
        _visualizer.Reset();
        Player.Init(_visualizer);
        TrackPath = trackPath;
        Interop?.InvokeEvent(new ConnectedEvent());
    }

    public static TimeSpan GetCurrentTrackPosition()
    {
        if (_reader is null)
            return TimeSpan.Zero;

        return _reader.CurrentTime;
    }

    public static TimeSpan GetCurrentTrackDuration()
    {
        if (_reader is null)
            return TimeSpan.MinValue;

        return _reader.TotalTime;
    }

    public static void SetPosition(TimeSpan position)
    {
        if (_reader is null)
            return;

        _reader.CurrentTime = position;
    }
}