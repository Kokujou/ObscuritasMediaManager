using ObscuritasMediaManager.Backend.Data.Food;
using ObscuritasMediaManager.Backend.Data.Music;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Ingredients")]
public class IngredientModel
{
    public static Expression<Func<RecipeIngredientMappingModel, object>> FromRecipeMapping =>
        mapping => new
        {
            mapping.IngredientName,
            mapping.Unit.Measurement,
            Category = mapping.Ingredient == null ? IngredientCategory.Miscellaneous : mapping.Ingredient.Category,
            Nation = Language.Unset,
            LowestKnownPrice = ""
        };

    [Key] [MaxLength(255)] public required string IngredientName { get; set; }
    [MaxLength(255)] public required string LowestKnownPrice { get; set; }
    public Language Nation { get; set; }
    public IngredientCategory Category { get; set; }
    public bool IsFluid { get; set; }
}