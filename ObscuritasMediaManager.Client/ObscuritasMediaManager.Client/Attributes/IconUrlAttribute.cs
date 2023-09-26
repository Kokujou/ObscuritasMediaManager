using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Attributes;

[AttributeUsage(AttributeTargets.Field, AllowMultiple = false)]
public class IconUrlAttribute(string url) : Attribute
{
    public string Url { get; } = url;
}