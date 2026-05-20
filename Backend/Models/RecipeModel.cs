using ObscuritasMediaManager.Backend.Data.Food;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

public class RecipeModel : RecipeModelBase
{
    // ReSharper disable once EntityFramework.ModelValidation.UnlimitedStringLength
    public string RecipeText { get; set; } = string.Empty;

    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public TimeSpan TotalTime => PreparationTime + CookingTime;

    [ForeignKey(nameof(RecipeIngredientMappingModel.RecipeId))]
    public IEnumerable<RecipeIngredientMappingModel> Ingredients { get; set; } = [];

    [ForeignKey(nameof(RecipeCookwareMappingModel.RecipeId))]
    public IEnumerable<RecipeCookwareMappingModel> Cookware { get; set; } = [];

    [NotMapped] public IEnumerable<string> IngredientNames => Ingredients.Select(x => x.IngredientName);

    [NotMapped]
    public IEnumerable<IngredientCategory> IngredientCategories =>
        Ingredients.Where(x => x.Ingredient is not null).Select(x => x.Ingredient!.Category).Distinct();

    [NotMapped] public IEnumerable<string> CookwareNames => Cookware.Select(x => x.Name);
}