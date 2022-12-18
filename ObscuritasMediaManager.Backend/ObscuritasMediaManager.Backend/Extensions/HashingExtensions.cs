using System.Security.Cryptography;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class HashingExtensions
{
    public static string GetFileHash(this FileInfo file)
    {
        using var md5 = MD5.Create();
        using var stream = File.OpenRead(file.FullName);
        var hash = md5.ComputeHash(stream);
        return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
    }
}