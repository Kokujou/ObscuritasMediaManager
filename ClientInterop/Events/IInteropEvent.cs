namespace ObscuritasMediaManager.ClientInterop.Events;

public interface IInteropEvent<T>
{
    InteropEvent Event { get; }
    T? Invoke();
}