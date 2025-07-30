using ObscuritasMediaManager.Backend.Data.Food;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

public class RecipeModel : RecipeModelBase
{
    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public TimeSpan TotalTime => PreparationTime + CookingTime;
    [MaxLength(9999)] public string? FormattedText { get; set; }

    [ForeignKey(nameof(RecipeIngredientMappingModel.RecipeId))]
    public IEnumerable<RecipeIngredientMappingModel> Ingredients { get; set; } = null!;

    [ForeignKey(nameof(RecipeCookwareMappingModel.RecipeId))]
    public IEnumerable<RecipeCookwareMappingModel> Cookware { get; set; } = null!;

    [NotMapped] public IEnumerable<string> IngredientNames => Ingredients.Select(x => x.IngredientName);

    [NotMapped]
    public IEnumerable<IngredientCategory> IngredientCategories =>
        Ingredients.Where(x => x.Ingredient is not null).Select(x => x.Ingredient!.Category).Distinct();

    [NotMapped] public IEnumerable<string> CookwareNames => Cookware.Select(x => x.Name);
}