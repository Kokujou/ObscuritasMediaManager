using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Cookware")]
public class RecipeCookwareMappingModel
{
    [Key] public Guid RecipeId { get; set; }
    [MaxLength(255)] public required string Name { get; set; }
}