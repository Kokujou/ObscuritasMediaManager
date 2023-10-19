using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

interface ICommandHandler
{
    InteropCommand Command { get; }

    Task ExecuteAsync(object? payload);
}
