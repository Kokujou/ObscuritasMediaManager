using ObscuritasMediaManager.Backend.Data.Food;
using ObscuritasMediaManager.Backend.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace ObscuritasMediaManager.Backend.Controllers.Responses;

public class IngredientResponse
{
    public static Expression<Func<RecipeIngredientMappingModel, IngredientResponse>> FromRecipeMapping =>
        mapping => new()
        {
            Name = mapping.IngredientName, Measurement = mapping.Unit.Measurement, Category = mapping.IngredientCategory
        };

    [MaxLength(255)] public required string Name { get; set; }
    public IngredientCategory Category { get; set; }
    public Measurement Measurement { get; set; }
}