
using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class ScrollSelect<T>
{
    [Parameter] public IEnumerable<T> Options { get; set; } = new List<T>();
    [Parameter] public T? Value { get; set; }
    [Parameter] public EventCallback<T> ValueChanged { get; set; }
}