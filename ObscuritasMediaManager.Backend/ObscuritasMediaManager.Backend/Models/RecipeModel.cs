﻿using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Food;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Recipes", Schema = "dbo")]
public class RecipeModel
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public Nation Nation { get; set; }
    public string ImageUrl { get; set; }
    public int Difficulty { get; set; }
    public int Rating { get; set; }
    public Course Course { get; set; }
    public Ingredient MainIngredient { get; set; }
    public CookingTechnique Technique { get; set; }
    public TemperatureUnit TemperatureUnit { get; set; }
    public TimeSpan PreparationTime { get; set; }
    public TimeSpan CookingTime { get; set; }
    public TimeSpan TotalTime => PreparationTime + CookingTime;

    public IEnumerable<IngredientModel> Ingredients { get; set; }

    public string FormattedText { get; set; }

    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<RecipeModel>();
        entity.HasMany(x => x.Ingredients).WithOne().HasForeignKey(x => x.RecipeId).HasPrincipalKey(x => x.Id);
        entity.Navigation(x => x.Ingredients).AutoInclude();
    }
}