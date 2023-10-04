using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public class Observable<T> where T : notnull
{
    public T Current => currentValue;

    private List<Subscription> subscriptions { get; set; } = new();
    private T currentValue { get; set; }

    public Observable(T initialValue)
    {
        currentValue = initialValue;
    }

    public Subscription Subscribe(Action<(T? oldValue, T? newValue)> observer)
    {
        var subscription = new Subscription((oldValue, newValue) => observer(((T?)oldValue, (T?)newValue)),
        (s) => subscriptions.Remove(s));
        subscriptions.Add(subscription);
        try
        {
            observer((currentValue, currentValue));
        }
        catch (Exception ex)
        {
            Log.Error(ex.ToString());
        }
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