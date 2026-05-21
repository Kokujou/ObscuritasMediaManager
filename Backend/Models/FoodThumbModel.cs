using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("FoodThumbMapping")]
public class FoodThumbModel
{
    [JsonIgnore] [Key] public int Id { get; private set; }
    public Guid RecipeId { get; set; } = Guid.NewGuid();

    public byte[]? ThumbData { get; set; }

    [MaxLength(32)]
    public string ThumbHash
    {
        get => ThumbData.GetHash();
        set => _ = value;
    }
}