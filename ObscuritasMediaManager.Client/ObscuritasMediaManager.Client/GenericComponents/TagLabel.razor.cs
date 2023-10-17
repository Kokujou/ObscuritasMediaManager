using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class TagLabel
{
    [Parameter] public string Text { get; set; } = string.Empty;
    [Parameter] public List<string> Autocomplete { get; set; } = new List<string>();
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public bool CreateNew { get; set; }
    [Parameter] public EventCallback<string> TagCreated { get; set; }
    [Parameter] public EventCallback Removed { get; set; }

    private List<string> FilteredAutocomplete
                             => Autocomplete.Where((x) => x.ToLower().Contains(searchText.ToLower())).ToList();

    private int autofillIndex { get; set; } = -1;
    private bool showAutocomplete { get; set; }
    private string searchText { get; set; } = string.Empty;

    private async Task NotifyTagCreated(string tag)
    {
        searchText = string.Empty;
        autofillIndex = -1;
        await TagCreated.InvokeAsync(tag);
    }

    private async Task handleInput(KeyboardEventArgs args)
    {
        if (args.Key == "ArrowDown")
        {
            autofillIndex++;
            if (autofillIndex >= FilteredAutocomplete.Count) autofillIndex = 0;
        }
        else if (args.Key == "ArrowUp")
        {
            if (autofillIndex <= 0) autofillIndex = FilteredAutocomplete.Count;
            autofillIndex--;
        }
        else if ((args.Key == "Enter") && (GetSelectedItem() is string selected))
            await NotifyTagCreated(selected);
    }

    private string? GetSelectedItem()
    {
        if (FilteredAutocomplete.Count <= 0) return null;
        if (FilteredAutocomplete.ElementAtOrDefault(autofillIndex) is string hovered) return hovered;
        return FilteredAutocomplete.First();
    }
}
