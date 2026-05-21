using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("FoodImageMapping")]
[Index(nameof(ImageHash), nameof(RecipeId), IsUnique = true)]
public class FoodImageModel
{
    [JsonIgnore] [Key] public int Id { get; private set; }

    public Guid RecipeId { get; set; } = Guid.NewGuid();

    [MaxLength(20)] public string? MimeType { get; set; }
    public byte[]? ImageData { get; set; }

    public int? ThumbId { get; set; }

    [ForeignKey(nameof(ThumbId))]
    [IgnoreAutoInclude]
    public FoodThumbModel? Thumb { get; set; }

    [MaxLength(32)]
    public string ImageHash
    {
        get => ImageData.GetHash();
        set => _ = value;
    }
}