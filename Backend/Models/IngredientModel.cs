using ObscuritasMediaManager.Backend.Data.Food;
using ObscuritasMediaManager.Backend.Data.Music;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Ingredients")]
public class IngredientModel
{
    [Key] [MaxLength(255)] public required string IngredientName { get; set; }
    [MaxLength(255)] public required string LowestKnownPrice { get; set; }
    public Language Nation { get; set; }
    public IngredientCategory Category { get; set; }
}