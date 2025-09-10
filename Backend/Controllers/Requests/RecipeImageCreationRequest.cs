using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class RecipeImageCreationRequest
{
    public required FoodImageModel Image { get; set; }
    public required FoodThumbModel Thumb { get; set; }
}