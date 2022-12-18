namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class UpdateRequest<T>
{
    public T OldModel { get; set; }
    public T NewModel { get; set; }
}