namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class UpdateRequest<T>
{
    public required T OldModel { get; set; }
    public required T NewModel { get; set; }
}