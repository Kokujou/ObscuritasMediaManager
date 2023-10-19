using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFilesHandler : IQueryHandler
{
    public InteropQuery Query => InteropQuery.RequestFiles;

    public async Task<object> ExecuteAsync(JsonElement? payload)
    {
        return new { };
    }
}
