namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class FoodImageCreationRequest
{
    public required byte[] ImageData { get; set; }
    public required byte[] ThumbData { get; set; }
}