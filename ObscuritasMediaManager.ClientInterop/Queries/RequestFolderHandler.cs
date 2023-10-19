using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFolderHandler : IQueryHandler
{
    public InteropQuery Query => InteropQuery.RequestFolder;

    public async Task<object> ExecuteAsync(JsonElement? payload)
    {
        return new { };
    }
}
