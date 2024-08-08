using ObscuritasMediaManager.Backend.Data.Food;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Ingredients")]
public class IngredientModel
{
    [Key] public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    [MaxLength(255)] public required string Name { get; set; }
    [MaxLength(9999)] public string? Description { get; set; }
    [MaxLength(255)] public string? GroupName { get; set; }
    public double Amount { get; set; }
    public Measurement Measurement { get; set; }
    public int Order { get; set; }
}