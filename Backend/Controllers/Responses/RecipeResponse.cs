using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers.Responses;

public class RecipeResponse
{
    public required RecipeModelBase Recipe { get; set; }
    public required List<string> ImageHashes { get; set; }
}