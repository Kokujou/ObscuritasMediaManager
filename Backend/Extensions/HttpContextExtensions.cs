using System.Text;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class HttpContextExtensions
{
    public static async Task<T> ReadRequestBodyAsync<T>(this HttpContext context, JsonSerializerOptions serializerOptions)
    {
        context.Request.Body.Position = 0;
        using var reader = new StreamReader(context.Request.Body, encoding: Encoding.UTF8,
        detectEncodingFromByteOrderMarks: false, leaveOpen: true);

        var body = await reader.ReadToEndAsync();
        context.Request.Body.Position = 0;
        return JsonSerializer.Deserialize<T>(body, serializerOptions);
    }
}
