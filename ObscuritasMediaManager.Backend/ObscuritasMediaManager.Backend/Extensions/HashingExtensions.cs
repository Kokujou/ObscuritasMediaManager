using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace ObscuritasMediaManager.Backend.Extensions
{
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
}
