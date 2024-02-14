using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Data;

public class Observable<T>(T initialValue)
    where T : notnull
{
    public T Current => currentValue;

    private List<Subscription> subscriptions { get; set; } = new();
    private T currentValue { get; set; } = initialValue;

    public Subscription Subscribe(Action<(T? oldValue, T? newValue)> observer, bool skipInitial = false)
    {
        var subscription = new Subscription((oldValue, newValue) => observer(((T?)oldValue, (T?)newValue)), (s) => subscriptions.Remove(s));
        subscriptions.Add(subscription);
        if (skipInitial) return subscription;
        try
        {
            observer((currentValue, currentValue));
        }
        catch (Exception ex) { }
        return subscription;
    }

    public void Next(T value)
    {
        var oldValue = currentValue;
        currentValue = value;

        foreach (var subscription in subscriptions)
            try
            {
                subscription.observer(currentValue, oldValue);
            }
            catch { }
    }
}