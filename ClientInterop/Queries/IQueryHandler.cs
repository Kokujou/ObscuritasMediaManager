using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Queries;

interface IQueryHandler
{
    InteropQuery Query { get; }

    Task<object?> ExecuteAsync(JsonElement? payload);
}
