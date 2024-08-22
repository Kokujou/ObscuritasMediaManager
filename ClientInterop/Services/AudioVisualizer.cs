using NAudio.Dsp;
using System.Diagnostics;

namespace ObscuritasMediaManager.ClientInterop.Services;

public class AudioVisualizer : ISampleProvider
{
    private static bool IsPowerOfTwo(int x)
    {
        return (x & (x - 1)) == 0;
    }

    private readonly int channels;
    private readonly FftEventArgs fftArgs;
    private readonly Complex[] fftBuffer;
    private readonly int fftLength;
    private readonly int m;
    private readonly float[] sampleBuffer;
    private readonly ISampleProvider source;
    private int count;
    public Observable<FftEventArgs>? FftCalculated = new(new([]));
    private int fftPos;
    public Observable<MaxSampleEventArgs>? MaximumCalculated = new(new(0, 0));
    private float maxValue;
    private float minValue;
    private int samplePos;
    public Observable<float[]> Samples = new([]);
    public int NotificationCount { get; set; }
    public bool PerformFFT { get; set; }

    public AudioVisualizer(ISampleProvider newSource, int fftLength = 1024)
    {
        channels = newSource.WaveFormat.Channels;
        if (!IsPowerOfTwo(fftLength)) throw new ArgumentException("FFT Length must be a power of two");

        m = (int)Math.Log(fftLength, 2.0);
        this.fftLength = fftLength;
        fftBuffer = new Complex[fftLength];
        sampleBuffer = new float[fftLength];
        fftArgs = new(fftBuffer);
        source = newSource;
    }

    public WaveFormat WaveFormat => source.WaveFormat;

    public int Read(float[] buffer, int offset, int length)
    {
        var samplesRead = source.Read(buffer, offset, length);

        for (var n = 0; n < samplesRead; n += channels) Add(buffer[n + offset]);

        return samplesRead;
    }

    public void Reset()
    {
        count = 0;
        maxValue = minValue = 0;
    }

    private void Add(float value)
    {
        if (PerformFFT && FftCalculated is not null)
        {
            if (fftPos >= fftBuffer.Length)
            {
                fftPos = 0;
                FastFourierTransform.FFT(true, m, fftBuffer);
                FftCalculated.Next(fftArgs);
            }

            fftBuffer[fftPos].X = (float)(value * FastFourierTransform.HammingWindow(fftPos, fftLength));
            fftBuffer[fftPos].Y = 0;
            fftPos++;
        }
        else if (!PerformFFT)
        {
            if (samplePos >= sampleBuffer.Length)
            {
                samplePos = 0;
                Samples.Next(sampleBuffer);
            }

            sampleBuffer[samplePos] = value;
            samplePos++;
        }

        maxValue = Math.Max(maxValue, value);
        minValue = Math.Min(minValue, value);
        count++;
        if (count >= NotificationCount && NotificationCount > 0 && MaximumCalculated is not null)
        {
            MaximumCalculated.Next(new(minValue, maxValue));
            Reset();
        }
    }
}

[method: DebuggerStepThrough]
public class MaxSampleEventArgs(float minValue, float maxValue) : EventArgs
{
    public float MaxSample { get; private set; } = maxValue;
    public float MinSample { get; private set; } = minValue;
}

[method: DebuggerStepThrough]
public class FftEventArgs(Complex[] result) : EventArgs
{
    public Complex[] Result { get; private set; } = result;
}