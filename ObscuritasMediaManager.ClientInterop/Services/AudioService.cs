
namespace ObscuritasMediaManager.ClientInterop.Services;

public static class AudioService
{
    public static float Volume { get => player.Volume; set => player.Volume = value; }

    public static TimeSpan Position { get => reader?.CurrentTime ?? TimeSpan.Zero; set => SetPosition(value); }

    public static float[] VisualizationData = new float[0];
    private static WaveOutEvent player = new WaveOutEvent();
    private static MediaFoundationReader? reader;
    private static AudioVisualizer? visualizer;

    public static void Pause()
    {
        player.Pause();
    }

    public static void Play()
    {
        player.Play();
    }

    public static void Stop()
    {
        player.Stop();
    }

    public static void ChangeTrack(string trackPath)
    {
        try
        {
            player.Stop();
            reader?.Dispose();
            player.Dispose();
            player = new WaveOutEvent();
            reader = new MediaFoundationReader(trackPath);
            if (visualizer is null)
            {
                visualizer = new AudioVisualizer(reader.ToSampleProvider());
                visualizer.Samples.Subscribe(x => VisualizationData = x.newValue ?? new float[0]);
            }
            else
                visualizer.Initialize(reader.ToSampleProvider());
            visualizer.Reset();
            player.Init(visualizer);
        }
        catch { }
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