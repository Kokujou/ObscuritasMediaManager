
using Microsoft.AspNetCore.Components;
using System.Windows.Forms;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class ScrollSelect<T> where T : struct
{
    [Parameter] public IList<T> Options { get; set; } = new List<T>();
    [Parameter] public T Value { get; set; }
    [Parameter] public EventCallback<T> ValueChanged { get; set; }

    private ElementReference ActiveElement { get => _activeElement; set => SetActiveElement(value); }

    private ElementReference _activeElement;
    private bool activeElementChanged = true;
    private bool mouseDown = false;
    private int mouseStartY = 0;
    private int scrollPosY = 0;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);

        if (!activeElementChanged) return;

        var currentItemIndex = Options.IndexOf(Value);
        scrollPosY = (currentItemIndex * (-40)) + 10;
        StateHasChanged();
        activeElementChanged = false;
    }

    private void ScrollToItem(T value)
    {
        Value = value;
        var currentIndex = Options.IndexOf(Value);
        scrollPosY = (currentIndex * (-40)) + 10;
        ValueChanged.InvokeAsync(value);
    }

    private void SetActiveElement(ElementReference value)
    {
        if (_activeElement.Id == value.Id) return;
        _activeElement = value;
        activeElementChanged = true;
    }

    private async Task StartDragScrollingAsync()
    {
        mouseDown = true;
        mouseStartY = Cursor.Position.Y;
        StateHasChanged();

        await this.StartMouseMoveInputLoopAsync(OnPointerMoveAsync);
        await OnPointerReleasedAsync();
    }

    private async Task OnPointerMoveAsync()
    {
        await Task.Yield();
        if (!mouseDown) return;
        var deltaY = Cursor.Position.Y - mouseStartY;
        mouseStartY = Cursor.Position.Y;
        scrollPosY += deltaY * 2;
        StateHasChanged();
    }

    private async Task OnPointerReleasedAsync()
    {
        if (!mouseDown) return;
        mouseDown = false;
        mouseStartY = 0;
        var mappedIndex = (int)Math.Round(scrollPosY / (-40f));
        Value = Options.ElementAtOrDefault(mappedIndex);
        activeElementChanged = true;
        await ValueChanged.InvokeAsync(Value);
        StateHasChanged();
    }
}