using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("FoodImageMapping")]
[Index(nameof(ImageHash), IsUnique = true)]
[PrimaryKey(nameof(RecipeId), nameof(ImageHash))]
public class FoodImageModel
{
    public Guid RecipeId { get; set; } = Guid.NewGuid();

    [MaxLength(20)] public string? MimeType { get; set; }
    public byte[]? ImageData { get; set; }

    public byte[]? ThumbData { get; set; }

    [JsonIgnore]
    [MaxLength(32)]
    public string ImageHash
    {
        get => ImageData.GetHash();
        set => _ = value;
    }
}