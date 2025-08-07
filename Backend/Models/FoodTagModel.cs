using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("FoodTagMapping")]
[PrimaryKey(nameof(RecipeId), nameof(Key), nameof(Value))]
public class FoodTagModel
{
    public required Guid? RecipeId { get; set; } = null!;

    [MaxLength(255)] public required string Key { get; set; } = null!;
    [MaxLength(255)] public required string Value { get; set; } = null!;
}