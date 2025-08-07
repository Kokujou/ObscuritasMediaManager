using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("FoodImageMapping")]
[Index(nameof(ImageHash), IsUnique = true)]
public class FoodImageModel
{
    [Key] public Guid RecipeId { get; set; }
    // ReSharper disable once EntityFramework.ModelValidation.UnlimitedStringLength
    public string? ImageData { get; set; }

    [JsonIgnore]
    [MaxLength(32)]
    public string ImageHash
    {
        get => ImageData.GetHash();
        set => _ = value;
    }
}