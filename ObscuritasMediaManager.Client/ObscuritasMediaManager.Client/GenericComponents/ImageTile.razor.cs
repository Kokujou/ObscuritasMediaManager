using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class ImageTile
{
    [Parameter] public string Image { get; set; } = string.Empty;
    [Parameter] public string Caption { get; set; } = string.Empty;
}
