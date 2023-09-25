using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public class Subscription
{
    public Action<object?, object?>  observer { get; set; }
    public Action unsubscribe { get; set; }

    public Subscription(Action<object?, object?> observer2, Action<Subscription> unsubscribeAction)
    {
        observer = observer2;
        unsubscribe = () => unsubscribeAction(this);
    }
}
