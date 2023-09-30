using NAudio.Dsp;
using NAudio.Wave;
using System;
using System.Diagnostics;
using System.Linq;

namespace ObscuritasMediaManager.Client.Services;

public class AudioVisualizer : ISampleProvider
{
    private static bool IsPowerOfTwo(int x)
    {
        return (x & (x - 1)) == 0;
    }

    public int NotificationCount { get; set; }
    public bool PerformFFT { get; set; }

    public WaveFormat WaveFormat => source.WaveFormat;

    public Observable<MaxSampleEventArgs>? MaximumCalculated = new(new(0, 0));
    public Observable<FftEventArgs>? FftCalculated = new(new(new Complex[0])) ;
    public Observable<float[]> Samples = new(new float[0]);
    private ISampleProvider source;
    private float maxValue;
    private float minValue;
    private int count;
    private Complex[] fftBuffer;
    private float[] sampleBuffer;
    private FftEventArgs fftArgs;
    private int fftPos;
    private int samplePos;
    private int fftLength;
    private int m;
    private int channels;

    public AudioVisualizer(ISampleProvider source, int fftLength = 1024)
    {
        Initialize(source, fftLength);
    }

    public void Initialize(ISampleProvider source, int fftLength = 1024)
    {
        channels = source.WaveFormat.Channels;
        if (!IsPowerOfTwo(fftLength))
            throw new ArgumentException("FFT Length must be a power of two");
        m = (int)Math.Log(fftLength, 2.0);
        this.fftLength = fftLength;
        fftBuffer = new Complex[fftLength];
        sampleBuffer = new float[fftLength];
        fftArgs = new FftEventArgs(fftBuffer);
        this.source = source;
    }

    public void Reset()
    {
        count = 0;
        maxValue = minValue = 0;
    }

    public int Read(float[] buffer, int offset, int count)
    {
        var samplesRead = source.Read(buffer, offset, count);

        for (var n = 0; n < samplesRead; n += channels)
            Add(buffer[n + offset]);
        return samplesRead;
    }

    private void Add(float value)
    {
        if (PerformFFT && (FftCalculated is not null))
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
        else if (!PerformFFT && (Samples is not null))
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
        if ((count >= NotificationCount) && (NotificationCount > 0) && (MaximumCalculated is not null))
        {
            MaximumCalculated.Next(new MaxSampleEventArgs(minValue, maxValue));
            Reset();
        }
    }
}

public class MaxSampleEventArgs : EventArgs
{
    public float MaxSample { get; private set; }
    public float MinSample { get; private set; }

    [DebuggerStepThrough]
    public MaxSampleEventArgs(float minValue, float maxValue)
    {
        MaxSample = maxValue;
        MinSample = minValue;
    }
}

public class FftEventArgs : EventArgs
{
    public Complex[] Result { get; private set; }

    [DebuggerStepThrough]
    public FftEventArgs(Complex[] result)
    {
        Result = result;
    }
}
