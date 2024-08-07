﻿using System.Security.Cryptography;
using System.Text;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class EncryptionExtensions
{
    public static string Encrypt(this string text)
    {
        return Convert.ToBase64String(
            ProtectedData.Protect(Encoding.Unicode.GetBytes(text), null, DataProtectionScope.LocalMachine));
    }

    public static string Decrypt(this string text)
    {
        return Encoding.Unicode
            .GetString(
                ProtectedData.Unprotect(Convert.FromBase64String(text), null, DataProtectionScope.LocalMachine));
    }
}