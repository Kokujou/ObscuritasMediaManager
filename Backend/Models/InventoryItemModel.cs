using ObscuritasMediaManager.Backend.Data.Food;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Inventory")]
public class InventoryItemModel
{
    [Key] public required Guid ItemId { get; set; } = Guid.NewGuid();
    public required InventoryTarget Target { get; set; }
    [MaxLength(255)] public required string IngredientName { get; set; }
    public required float Quantity { get; set; }
    public MeasurementUnit Unit { get; set; } = null!;
    public int? Level { get; set; }

    [ForeignKey(nameof(IngredientName))] public IngredientModel? Ingredient { get; set; } = null!;
}