using NAudio.Wave;
using ObscuritasMediaManager.Client.Services;

public class AudioService
{
    public float Volume { get => player.Volume; set => player.Volume = value; }

    public TimeSpan Position { get => reader?.CurrentTime ?? TimeSpan.Zero; set => SetPosition(value); }

    public float[] VisualizationData = new float[0];
    private WaveOutEvent player = new WaveOutEvent();
    private MediaFoundationReader? reader;
    private AudioVisualizer? visualizer;

    public void Pause()
    {
        player.Pause();
    }

    public void Play()
    {
        player.Play();
    }

    public void Stop()
    {
        player.Stop();
    }

    public async Task ChangeTrackAsync(MusicModel track)
    {
        player.Stop();
        reader?.Dispose();
        player.Dispose();
        player = new WaveOutEvent();
        reader = new MediaFoundationReader(track.Path);
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

    public bool Paused()
    {
        return player.PlaybackState != PlaybackState.Playing;
    }

    public TimeSpan GetCurrentTrackPosition()
    {
        if (reader is null) return TimeSpan.Zero;
        return reader.CurrentTime;
    }

    public TimeSpan GetCurrentTrackDuration()
    {
        if (reader is null) return TimeSpan.MinValue;
        return reader.TotalTime;
    }

    public void SetPosition(TimeSpan position)
    {
        if (reader is null) return;
        reader.CurrentTime = position;
    }
}