using ObscuritasMediaManager.Backend.Data.Food;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("RecipeIngredientMapping")]
public class RecipeIngredientMappingModel
{
    [Key] public Guid Id { get; set; }
    public Guid RecipeId { get; set; }

    [MaxLength(255)] public required string IngredientName { get; set; }
    public required IngredientCategory IngredientCategory { get; set; }
    [MaxLength(9999)] public string? Description { get; set; }
    [MaxLength(255)] public string? GroupName { get; set; }
    [NotMapped] public required MeasurementUnit Unit { get; set; }
    public float Amount { get; set; }
    public int Order { get; set; }
}