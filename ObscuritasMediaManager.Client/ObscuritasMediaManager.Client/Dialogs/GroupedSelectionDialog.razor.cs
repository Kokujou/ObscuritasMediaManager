using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Client.Layout;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Dialogs;

public static class GroupedSelectionDialog
{
    public static async Task ShowAsync<T>(string heading, List<T> items, Action<GroupedSelectionDialog<T>> configure)
        where T : class

    {
        await GroupedSelectionDialog<T>.ShowAsync(heading, items, configure);
    }
}

public partial class GroupedSelectionDialog<T> where T : class
{
    public static async Task ShowAsync(string heading, List<T> items, Action<GroupedSelectionDialog<T>> configure)
    {
        var tcs = new TaskCompletionSource();
        var dialog = await PageLayout.SpawnComponentAsync<GroupedSelectionDialog<T>>();
        dialog.Heading = heading;
        dialog.Items = items;
        configure(dialog);
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

    public List<T> Items { get; set; } = new();
    public Func<T, bool> IsSelected { get; set; } = _ => false;
    public Func<T, string> GetGroupName { get; set; } = _ => string.Empty;
    public Func<T, string> GetName { get; set; } = _ => string.Empty;
    public bool CanRemove { get; set; }
    public bool CanAdd { get; set; }
    public Func<T, Task> ItemDeletedAsync { get; set; } = (_) => Task.CompletedTask;
    public Func<(string Group, string Name), Task> ItemAddedAsync { get; set; } = (_) => Task.CompletedTask;
    public Func<T, Task> ItemToggledAsync { get; set; } = (_) => Task.CompletedTask;
    private bool DeleteMode { get; set; }
    private bool AddMode { get; set; }
}

[EventHandler("oninput2", typeof(Input2EventArgs), enableStopPropagation: true, enablePreventDefault: true)]
public static class EventHandlers { }

public class Input2EventArgs : EventArgs
{
    public string? Key { get; set; }
    public string? Value { get; set; }
}