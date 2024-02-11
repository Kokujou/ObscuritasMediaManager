using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

public interface IInteropEvent<T>
{
    InteropEvent Event { get; }

    T? Invoke();
}
