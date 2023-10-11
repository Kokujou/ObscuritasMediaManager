using Microsoft.AspNetCore.Components;
using System;
using System.Linq;
using System.Text.Json;
using System.Windows.Forms;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class RangeSelector
{
    [Parameter] public int Min { get; set; }
    [Parameter] public int Max { get; set; }
    [Parameter] public int? Left { get; set; }
    [Parameter] public int? Right { get; set; }
    [Parameter] public EventCallback<(int left, int right)> RangeChanged { get; set; }
    public required ElementReference Container { get; set; }

    private int leftPercent => GetLeftPercent();

    private int rightPercent => GetRightPercent();

    private bool draggingLeft;
    private bool draggingRight;
    private List<IDisposable> disposables = new();
    private Task? MouseMoveTask;

    public override void Dispose()
    {
        base.Dispose();
        foreach (var disposable in  disposables) disposable.Dispose();
    }

    protected override void OnAfterRender(bool firstRender)
    {
        Left ??= Min;
        Right ??= Max;

        base.OnAfterRender(firstRender);
    }

    private async Task StartDragging(bool right)
    {
        if (MouseMoveTask is not null)
        {
            MouseMoveTask.Dispose();
            MouseMoveTask = null;
        }
        if (right)
            draggingRight = true;
        else
            draggingLeft = true;

        await this.StartMouseMoveInputLoopAsync(async () =>
            {
                var rect = await JS.InvokeAsync<JsonElement>("getElementRect", Container);
                OnMouseMove(rect);
            });
        await RangeChanged.InvokeAsync((Left ?? 0, Right ?? 0));
    }

    private async Task MouseMoveLoop()
    {
        while (true)
            await Task.Delay(100);
    }

    private void OnMouseMove(dynamic rect)
    {
        try
        {
            if (!draggingLeft && !draggingRight)
                return;
            var position = GetValueForMousePosition(Cursor.Position.X, rect);
            if (draggingLeft && (position < Right))
                Left = position;
            else if (draggingRight && (position > Left)) Right = position;
            StateHasChanged();
        }
        catch (Exception ex) { }
    }

    private int GetValueForMousePosition(int currentMouseX, JsonElement rect)
    {
        if ((Container.Id is null) || (MainWindow.Instance is null)) return 0;
        var elementLeft = MainWindow.Instance.PointToScreen(new(rect.GetProperty("left").GetDouble(), 0)).X;
        var elementRight = MainWindow.Instance.PointToScreen(new(rect.GetProperty("right").GetDouble(), 0)).X;
        var rangeAvailable = (Max - Min) / 100f;
        var relativeLeft = currentMouseX - elementLeft;
        var realWidth = elementRight - elementLeft;
        var leftPercent = (relativeLeft / realWidth) * 100f;

        var targetValue = Math.Round(Min + (rangeAvailable * leftPercent));
        if (leftPercent < 0)
            return Min;
        if (leftPercent > 100)
            return Max;

        return (int)targetValue;
    }

    private int GetLeftPercent()
    {
        if (Left is null) return 0;
        float? left = Left - Min;
        float? max = Max - Min;
        return (int)((left / max) * 100);
    }

    private int GetRightPercent()
    {
        if (Right is null) return 100;
        float? right = Right - Min;
        float? max = Max - Min;
        return (int)((right / max) * 100);
    }
}
