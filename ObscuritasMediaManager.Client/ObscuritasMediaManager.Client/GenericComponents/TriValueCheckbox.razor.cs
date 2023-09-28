
using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class TriValueCheckbox
{
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public CheckboxState value { get; set; } = CheckboxState.Ignore;
    [Parameter] public CheckboxState ignoredState { get; set; } = CheckboxState.Ignore;
    [Parameter] public bool disabled { get; set; }
    [Parameter] public bool allowThreeValues { get; set; }
    [Parameter] public EventCallback<CheckboxState> valueChanged { get; set; }

    public void NextState()
    {
        value = value.NextValue();
        if ((value == ignoredState) && !allowThreeValues)
            value = value.NextValue();

        valueChanged.InvokeAsync(value);
    }
}