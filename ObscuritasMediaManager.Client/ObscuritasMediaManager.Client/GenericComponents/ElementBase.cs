using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.GenericComponents;

public class ElementBase : ComponentBase, IDisposable
{
    public List<Subscription> Subscriptions { get; set; } = new();
    [Inject] public required Session Session { get; set; }

    public virtual void Dispose()
    {
        foreach (var subscription in Subscriptions) subscription.unsubscribe();
    }
}
