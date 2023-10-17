using ObscuritasMediaManager.Client.Layout;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Dialogs;

public partial class GroupedSelectionDialog
{
    public static async Task ShowAsync(string heading, Dictionary<string, List<string>> groups,
        Dictionary<string, List<string>> selected, bool canRemove, bool canAdd)
    {
        var tcs = new TaskCompletionSource();
        var dialog = await PageLayout.SpawnComponentAsync<GroupedSelectionDialog>();
        dialog.Heading = heading;
        dialog.Groups = groups;
        dialog.SelectedGroups = selected;
        dialog.CanRemove = canRemove;
        dialog.CanAdd = canAdd;
        dialog.Actions = new()
        {
            new()
            {
                Text = "Schließen",
                CanExecute = true,
                OnExecute = (_) => tcs.SetResult(),
                SupportedKeyCodes = new() { "Escape" }
            }
        };
        dialog.StateHasChanged();

        await tcs.Task;
        PageLayout.RemoveComponent(dialog);
    }

    public Dictionary<string, List<string>> Groups { get; set; } = new();
    public Dictionary<string, List<string>> SelectedGroups { get; set; } = new();
    public bool CanRemove { get; set; }
    public bool CanAdd { get; set; }

    private void ToggleItem(string group, string item)
    {
        if (!SelectedGroups.ContainsKey(group)) SelectedGroups.Add(group, new());
        if (SelectedGroups[group].Remove(item)) return;
        SelectedGroups[group].Add(item);
    }
}
