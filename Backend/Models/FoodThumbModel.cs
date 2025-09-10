using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("FoodThumbMapping")]
[PrimaryKey(nameof(RecipeId), nameof(ThumbHash))]
public class FoodThumbModel
{
    public Guid RecipeId { get; set; } = Guid.NewGuid();

    public byte[]? ThumbData { get; set; }

    [JsonIgnore]
    [MaxLength(32)]
    public string ThumbHash
    {
        get => ThumbData.GetHash();
        set => _ = value;
    }
}