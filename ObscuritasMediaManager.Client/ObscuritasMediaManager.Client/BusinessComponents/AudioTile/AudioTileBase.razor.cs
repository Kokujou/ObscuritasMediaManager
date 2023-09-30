using Microsoft.AspNetCore.Components;
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
    private CancellationTokenSource DrawCancellation { get; set; } = new();
    private int hoveredRating = 0;

    public override async Task SetParametersAsync(ParameterView parameters)
    {
        var pausedBefore = Paused;
        await base.SetParametersAsync(parameters);
        if (pausedBefore == Paused) return;
        if (Paused)
            DrawCancellation.Cancel();
        else
        {
            DrawCancellation = new();
            _ = Task.Run(async () =>
                {
                    while (true)
                      await RefreshCanvas(Audio.VisualizationData).ConfigureAwait(false);
                }, DrawCancellation.Token)
                .ConfigureAwait(false);
        }
    }

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();
        Subscriptions.AddRange(Session.instruments.Subscribe((_) => StateHasChanged()));
    }

    protected override bool ShouldRender()
    {
        if (Track is null) return false;

        return true;
    }

    private async Task RefreshCanvas(float[] visualizationData)
    {
        await JS.InvokeVoidAsync("renderVisualization", visualizationData).ConfigureAwait(false);
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
}