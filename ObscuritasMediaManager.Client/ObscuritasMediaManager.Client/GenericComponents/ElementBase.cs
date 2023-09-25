using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.GenericComponents;

public class ElementBase : ComponentBase, IDisposable
{
    [Parameter] public string Id { get; set; } = string.Empty;
    [Parameter] public string Class { get; set; } = string.Empty;
    public List<Subscription> Subscriptions { get; set; } = new();

    public void Dispose()
    {
        foreach (var subscription in Subscriptions) subscription.unsubscribe();
    }
}
