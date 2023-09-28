using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class CustomToggle
{
    [Parameter] public string? Color { get; set; }
    [Parameter] public CheckboxState state { get; set; }
    [Parameter] public bool threeValues { get; set; }
    [Parameter] public EventCallback<CheckboxState> Toggled { get; set; }

    public void Toggle()
    {
        if (threeValues)
            state = state.NextValue();
        else
            state = (state == CheckboxState.Ignore) ? CheckboxState.Forbid : CheckboxState.Ignore;
        Toggled.InvokeAsync(state);
    }
}