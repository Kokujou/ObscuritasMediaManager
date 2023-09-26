using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public class Observable<T>
{
    public T? currentValue { get; set; }
    public List<Subscription> subscriptions = new();

    public Observable(T initialValue)
    {
        currentValue = initialValue;
    }

    public Subscription subscribe(Action<(T? oldValue, T? newValue)> observer)
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

    public void next(T value)
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

    public T? current()
    {
        return currentValue;
    }
}