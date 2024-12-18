using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Food;
using ObscuritasMediaManager.Backend.Data.Music;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Recipes")]
public class RecipeModel
{
    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<RecipeModel>();
        builder.Entity<RecipeIngredientMappingModel>();
    }

    public Guid Id { get; set; }
    [MaxLength(255)] public required string Title { get; set; }
    public Language Nation { get; set; }
    [MaxLength(255)] public string? ImageUrl { get; set; }
    public int Difficulty { get; set; }
    public int Rating { get; set; }
    public Course Course { get; set; }
    public CookingTechnique Technique { get; set; }
    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public TimeSpan TotalTime => PreparationTime + CookingTime;

    [ForeignKey(nameof(RecipeIngredientMappingModel.RecipeId))]
    public IEnumerable<RecipeIngredientMappingModel> Ingredients { get; set; } = [];

    public IEnumerable<RecipeCookwareMappingModel> Cookware { get; set; } = [];
    [MaxLength(9999)] public string? FormattedText { get; set; }

    public IEnumerable<string> IngredientNames => Ingredients.Select(x => x.IngredientName);
    public IEnumerable<IngredientCategory> IngredientCategories =>
        Ingredients.Select(x => x.IngredientCategory).Distinct();
    public IEnumerable<string> CookwareNames => Cookware.Select(x => x.Name);
}