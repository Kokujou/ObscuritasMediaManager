using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Cookware")]
public class CookwareModel
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public required string Name { get; set; }

}
