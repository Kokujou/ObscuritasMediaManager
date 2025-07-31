using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class HashingExtensions
{
    private static readonly Dictionary<Type, List<PropertyInfo>> TypeSignatures = new();

    public static string GetFileHash(this FileInfo file)
    {
        using var md5 = MD5.Create();
        using var stream = File.OpenRead(file.FullName);
        var hash = md5.ComputeHash(stream);
        return BitConverter.ToString(hash).Replace("-", string.Empty).ToLowerInvariant();
    }

    public static string GetHash<T>(this T input)
    {
        var type = typeof(T);
        if (type == typeof(object))
            throw new ArgumentException("A concrete type is expected", nameof(T));
        return input.GetHash(type);
    }

    public static string GetHash(this object? input, Type type)
    {
        using var md5 = MD5.Create();

        if (type.IsPrimitive || type == typeof(string) || type == typeof(decimal))
            return string.Join(string.Empty,
                md5.ComputeHash(Encoding.UTF8.GetBytes(input?.ToString() ?? string.Empty))
                    .Select(x => x.ToString("X2")));

        List<PropertyInfo> hashableProperties;
        lock (TypeSignatures)
        {
            if (!TypeSignatures.TryGetValue(type, out hashableProperties!))
            {
                hashableProperties = type
                    .GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                    .Where(x => !Attribute.IsDefined(x, typeof(NotHashableAttribute)))
                    .ToList();
                TypeSignatures.Add(type, hashableProperties);
            }
        }

        var hashablePropertyValues =
            hashableProperties.ToDictionary(x => x.Name, x => x.GetValue(input));
        var jsonString = JsonSerializer.Serialize(hashablePropertyValues);
        var bytes = Encoding.UTF8.GetBytes(jsonString);
        var hashBytes = md5.ComputeHash(bytes);

        return string.Join(string.Empty, hashBytes.Select(x => x.ToString("X2")));
    }
}