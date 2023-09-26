using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Backend.Extensions;
using System.Text;

namespace ObscuritasMediaManager.Client.BusinessComponents.AudioTile;

public partial class AudioTileBase
{
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

    public string VisualizationData => $"data:image/svg+xml; base64, {CreateSvg(200, 200, null).ToBase64String()}";

    private int hoveredRating = 0;

    public string CreateSvg(int width, int height, double[]? visualizationData)
    {
        if (visualizationData is null) return string.Empty;
        var svg = new StringBuilder();
        svg.AppendLine($"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width}\" height=\"{height}\">");

        if (visualizationData == null) return svg.ToString();

        double sliceWidth = (width - 40.0) / visualizationData.Length;
        double x = 20;

        svg.AppendLine("<polyline points=\"");

        svg.Append($"0,{height / 2} ");
        svg.Append($"{x},{height / 2} ");

        for (var i = 0; i < visualizationData.Length; i++)
        {
            double y = (height / 2) + (visualizationData[i] * height);
            svg.Append($"{x},{y} ");
            x += sliceWidth;
        }

        svg.Append($"{width - 20},{height / 2} ");
        svg.Append($"{width},{height / 2}");

        svg.AppendLine("\" style=\"fill:none;stroke:white;stroke-width:2\" />");
        svg.AppendLine("</svg>");

        return svg.ToString();
    }

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();
        Session.instruments.subscribe((_) => StateHasChanged());
    }

    protected override bool ShouldRender()
    {
        if (Track is null) return false;

        return true;
    }
}