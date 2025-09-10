using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Recipes")]
[JsonPolymorphic(TypeDiscriminatorPropertyName = nameof(Type))]
[JsonDerivedType(typeof(FoodModel), "Food")]
[JsonDerivedType(typeof(RecipeModel), "Recipe")]
[Index(nameof(Title), IsUnique = true)]
public class RecipeModelBase
{
    public static void Configure(ModelBuilder builder)
    {
        builder.Entity<RecipeModelBase>().HasDiscriminator<string>("Type")
            .HasValue<RecipeModel>("Recipe")
            .HasValue<FoodModel>("Food");

        builder.Entity<RecipeIngredientMappingModel>().HasOne(x => x.Ingredient).WithMany()
            .OnDelete(DeleteBehavior.NoAction).HasForeignKey(x => x.IngredientName)
            .HasPrincipalKey(x => x.IngredientName).IsRequired(false);
    }

    [Key] public Guid Id { get; set; } = Guid.NewGuid();
    [MaxLength(255)] public required string Title { get; set; }
    [MaxLength(255)] public required string Description { get; set; }

    [ForeignKey(nameof(FoodImageModel.RecipeId))]
    [IgnoreAutoInclude]
    public required List<FoodImageModel> Images { get; set; } = [];

    [ForeignKey(nameof(FoodTagModel.RecipeId))]
    [IgnoreAutoInclude]
    public required List<FoodThumbModel> Thumbs { get; set; } = [];

    public int ImageCount { get; private set; }

    public int Difficulty { get; set; }
    public int Rating { get; set; }
    public bool Deleted { get; set; }
    [MaxLength(255)] public string? Type { get; set; }

    [ForeignKey(nameof(FoodTagModel.RecipeId))]
    public List<FoodTagModel> Tags { get; set; } = [];
}