namespace ObscuritasMediaManager.Backend.Exceptions;

public class ModelNotFoundException : Exception
{
    public ModelNotFoundException(string hash)
        : base($"The requested resource with the following hash-code could not be found: {hash}")
    {
    }

    public ModelNotFoundException(Guid id)
        : base($"The requested resource with the following identifier could not be found: {id}")
    {
    }
}