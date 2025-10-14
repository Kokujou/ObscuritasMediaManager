using Concentus;
using Concentus.Oggfile;
using System.IO;

namespace ObscuritasMediaManager.ClientInterop.Services;

public static class AudioService
{
    public static string? TrackPath { get; private set; }

    public static float Volume
    {
        get => Player.Volume;
        set
        {
            Player.Volume = value;
            TrackVolumeChanged?.Invoke(value);
        }
    }

    public static float[] VisualizationData { get; private set; } = [];
    public static WaveOutEvent Player { get; private set; } = new();

    public static event Action<PlaybackState>? PlaybackStateChanged;
    public static event Action<TimeSpan, float[]>? TrackPositionChanged;
    public static event Action<float>? TrackVolumeChanged;
    public static event Action<string, double>? TrackChanged;

    private static WaveStream? _reader;

    private static AudioVisualizer? _visualizer;

    public static void Pause()
    {
        Player.Pause();
        PlaybackStateChanged?.Invoke(Player.PlaybackState);
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

        PlaybackStateChanged?.Invoke(Player.PlaybackState);
    }

    public static void Stop()
    {
        Player.Stop();
        SetPosition(TimeSpan.Zero);
        PlaybackStateChanged?.Invoke(Player.PlaybackState);
    }

    public static async Task ChangeTrackAsync(string trackPath)
    {
        ArgumentNullException.ThrowIfNull(trackPath);

        Stop();
        Player.Dispose();
        Player = new();
        if (_reader is not null) await _reader.DisposeAsync()!;

        try
        {
            _reader = new MediaFoundationReader(trackPath);
        }
        catch
        {
            await using var fileIn = File.OpenRead(trackPath);
            var pcmStream = new MemoryStream();

            using var decoder = OpusCodecFactory.CreateDecoder(48000, 1);
            var oggIn = new OpusOggReadStream(decoder, fileIn);

            await Task.Run(() =>
            {
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
            });
            _reader = new RawSourceWaveStream(pcmStream, new(48000, 1));
        }

        _visualizer = new(_reader.ToSampleProvider());
        _visualizer.Samples.Subscribe(x => VisualizationData = x.newValue ?? []);
        _visualizer.Reset();
        Player.Init(_visualizer);
        TrackPath = trackPath;
        TrackChanged?.Invoke(trackPath, GetCurrentTrackDuration().TotalMilliseconds);
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
        TrackPositionChanged?.Invoke(position, VisualizationData);
    }
}