using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class RecipeCreationRequest
{
    public required RecipeModelBase Recipe { get; set; }
    public required FoodImageModel Image { get; set; }
}