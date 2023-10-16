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

    private List<string> AutocompleteItems
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
            if (autofillIndex >= AutocompleteItems.Count) autofillIndex = 0;
        }
        else if (args.Key == "ArrowUp")
        {
            if (autofillIndex <= 0) autofillIndex = AutocompleteItems.Count;
            autofillIndex--;
        }
        else if (args.Key == "Enter")
            await NotifyTagCreated(AutocompleteItems[(autofillIndex > 0) ? autofillIndex : 0]);
    }
}
