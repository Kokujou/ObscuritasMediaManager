using System;
using System.Text;

namespace ObscuritasMediaManager.Backend.Extensions
{
    public static class Base64Extensions
    {
        public static string ToBase64(this string target)
        {
            var bytes = Encoding.UTF8.GetBytes(target);
            return Convert.ToBase64String(bytes);
        }

        public static string FromBase64(this string target)
        {
            var bytes = Convert.FromBase64String(target);
            return Encoding.UTF8.GetString(bytes);
        }
    }
}