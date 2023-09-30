using Microsoft.AspNetCore.Components;
using NAudio.CoreAudioApi;
using NAudio.Wave;
using ObscuritasMediaManager.Client.Extensions;

namespace ObscuritasMediaManager.Client.BusinessComponents.AudioTile;

public partial class AudioTileBase
{
    [Parameter] public bool Paused { get; set; }
    [Parameter] public bool Visualize { get; set; }
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public required MusicModel Track { get; set; }
    [Parameter] public EventCallback Toggled { get; set; }
    [Parameter] public EventCallback ImageClicked { get; set; }
    [Parameter] public EventCallback ChangeLanguage { get; set; }
    [Parameter] public EventCallback NextParticipants { get; set; }
    [Parameter] public EventCallback NextInstrumentation { get; set; }
    [Parameter] public EventCallback<int> ChangeRating { get; set; }
    [Parameter] public EventCallback ChangeInstruments { get; set; }
    public required ElementReference Canvas { get; set; }
    public List<float> VisualizationData = new List<float>();
    private int hoveredRating = 0;

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();
        var devEnum = new MMDeviceEnumerator();
        var defaultDevice = devEnum.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);

        Subscriptions.AddRange(
            Session.instruments.Subscribe((_) => StateHasChanged()));
        var capture = new WasapiLoopbackCapture();
        const int endSize = 256;
        var step = (int)(capture.WaveFormat.AverageBytesPerSecond / ((float)endSize));
        capture.DataAvailable += (s, e) =>
        {
            if (Session.Audio.Paused() || (Session.Audio.Volume == 0)) return;
            VisualizationData = CreateTimeDomainData(e.Buffer, e.BytesRecorded, endSize);
        };

        capture.StartRecording();

        while (true)
        {
            await Task.Delay(100);
            try
            {
                await JS.InvokeVoidAsync("renderVisualization", Canvas, VisualizationData);
            }
            catch { }
        }
    }

    protected override bool ShouldRender()
    {
        if (Track is null) return false;

        return true;
    }

    private List<float> CreateTimeDomainData(byte[] buffer, int actualLength, int endSize)
    {
        var result = new List<float>(endSize);
        var floatArray = Enumerable.Range(0, actualLength / 4)
            .AsParallel()
            .Select(
                i => BitConverter.ToSingle(buffer, i * 4))
            .ToArray();
        var step = (int)(floatArray.Length / ((float)endSize));
        result = Enumerable.Range(0, endSize)
            .AsParallel()
            .Select(index =>
                {
                    var start = index * step;
                    var end = start + step;
                    var portion = floatArray[start..end];
                    if (portion.Length <= 0) return 0f;
                    return portion.Average();
                })
            .ToList();

        return result;
    }

    private void AudioTileBase_WaveFormatChanged(object? sender, EventArgs e)
    {
        throw new NotImplementedException();
    }
}