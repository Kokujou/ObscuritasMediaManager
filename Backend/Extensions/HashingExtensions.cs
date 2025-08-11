using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

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
            return string.Join("",
                MD5.HashData(Encoding.UTF8.GetBytes(input?.ToString() ?? ""))
                    .Select(x => x.ToString("X2")));

        var jsonString =
            JsonConvert.SerializeObject(input,
                new JsonSerializerSettings { ContractResolver = new OnlyHashablePropertiesContractResolver() });
        var bytes = Encoding.UTF8.GetBytes(jsonString);
        var hashBytes = MD5.HashData(bytes);
        return string.Join("", hashBytes.Select(x => x.ToString("X2")));
    }

    public class OnlyHashablePropertiesContractResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization serialization)
        {
            var prop = base.CreateProperty(member, serialization);

            if (member.GetCustomAttribute<NotHashableAttribute>() is not null)
                prop.ShouldSerialize = _ => false;

            return prop;
        }
    }
}