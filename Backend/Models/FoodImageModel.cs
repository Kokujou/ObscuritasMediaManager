using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("FoodThumbMapping")]
public class FoodImageModel
{
    [JsonIgnore] [Key] public int Id { get; private set; }
    public Guid RecipeId { get; set; }
    [MaxLength(255)] public string? ImagePath { get; set; }

    public byte[]? ThumbData { get; set; }

    [MaxLength(32)]
    public string ThumbHash
    {
        get => ThumbData.GetHash();
        set => _ = value;
    }
}