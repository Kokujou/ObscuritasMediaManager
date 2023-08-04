using ObscuritasMediaManager.Backend.Data.Food;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Ingredients", Schema = "dbo")]
public class IngredientModel
{
    [Key] public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string GroupName { get; set; }
    public double Amount { get; set; }
    public Measurement Measurement { get; set; }
    public int Order { get; set; }
}