namespace ObscuritasMediaManager.ClientInterop.Data;

public class Subscription : IDisposable
{
    public Action<object?, object?> observer { get; set; }
    public Action unsubscribe { get; set; }

    public Subscription(Action<object?, object?> observer2, Action<Subscription> unsubscribeAction)
    {
        observer = observer2;
        unsubscribe = () => unsubscribeAction(this);
    }

    public void Dispose()
    {
        unsubscribe();
    }
}