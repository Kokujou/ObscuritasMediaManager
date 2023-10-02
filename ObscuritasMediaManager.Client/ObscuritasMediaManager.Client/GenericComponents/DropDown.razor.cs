using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class DropDown<T>
{
    [Parameter] public IEnumerable<Option> options { get; set; } = new List<Option>();
    [Parameter] public string unsetText { get; set; } = string.Empty;
    [Parameter] public int maxDisplayDepth { get; set; }
    [Parameter] public bool required { get; set; }
    [Parameter] public bool threeValues { get; set; }
    [Parameter] public bool multiselect { get; set; }
    [Parameter] public bool useSearch { get; set; }
    [Parameter] public bool useToggle { get; set; }
    [Parameter] public bool disabled { get; set; }
    [Parameter] public EventCallback<Option> SelectionChanged { get; set; }

    private int MaxHeight => (maxDisplayDepth * 40) + (useSearch ? 50 : 0);

    private string caption
    {
        get
        {
            var notForbiddenOptions = options.Where((x) => x.state != CheckboxState.Forbid).ToList();
            if (!multiselect)
                return notForbiddenOptions.FirstOrDefault()?.text ?? unsetText;
            else if (notForbiddenOptions.Count == 0)
                return unsetText;
            else
                return string.Join(", ", notForbiddenOptions.Select((x) => x.text));
        }
    }

    private bool showDropdown;
    private string searchFilter = string.Empty;

    public void changeOptionState(Option option, CheckboxState state)
    {
        if ((state != CheckboxState.Forbid) && !multiselect)
            foreach (var o in options) o.state = CheckboxState.Forbid;
        option.state = state;

        SelectionChanged.InvokeAsync(option);
        if (!multiselect && !useToggle) ToggleDropdown();
    }

    private void ToggleDropdown()
    {
        showDropdown = !showDropdown;
        if (useSearch) searchFilter = string.Empty;
    }

    public class Option
    {
        public static List<Option> createSimpleArray(IEnumerable<T> values, T defaultValue)
        {
            return values.Select((key) => new Option
                                          {
                                              value = key,
                                              text = $"{key}",
                                              state = key.Equals(defaultValue) ? CheckboxState.Ignore : CheckboxState.Forbid,
                                          })
                .ToList();
        }

        public static List<Option> createSimpleArray(IEnumerable<T> values, Func<T, CheckboxState> getValue)
        {
            return values.Select((key) => new Option
                                          {
                                              value = key,
                                              text = $"{key}",
                                              state = getValue(key),
                                          })
                .ToList();
        }

        public required string text { get; set; }
        public required T value { get; set; }
        public required CheckboxState state { get; set; }
        public string color { get; set; } = string.Empty;
    }
}