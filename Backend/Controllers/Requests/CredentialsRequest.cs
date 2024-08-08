namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class CredentialsRequest
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}