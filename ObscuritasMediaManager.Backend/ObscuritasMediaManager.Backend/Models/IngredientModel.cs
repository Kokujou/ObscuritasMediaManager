using ObscuritasMediaManager.Backend.Data.Food;

namespace ObscuritasMediaManager.Backend.Models;

public class IngredientModel
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string GroupName { get; set; }
    public double Amount { get; set; }
    public Measurement Measurement { get; set; }
}