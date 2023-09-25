
namespace ObscuritasMediaManager.Backend.Data;

public class Credentials
{
    public static async Task<Credentials> FromLocalFileAsync()
    {
        var fileStream = File.Open("Credentials.ini", FileMode.OpenOrCreate);
        using var streamReader = new StreamReader(fileStream);
        var filecontent = await streamReader.ReadToEndAsync();
        var credentials = filecontent.Split("|");

        if (credentials.Length != 2) throw new UnauthorizedAccessException("unauthenticated");

        return new() { Username = credentials[0], Password = credentials[1] };
    }

    public string Username { get; set; }
    public string Password { get; set; }
}