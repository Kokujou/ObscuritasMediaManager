
namespace ObscuritasMediaManager.Backend.Data;

public class Credentials
{
    public static async Task<Credentials> FromLocalFileAsync()
    {
        using var fileStream = File.Open("Credentials.ini", FileMode.OpenOrCreate, FileAccess.Read, FileShare.ReadWrite);
        using var streamReader = new StreamReader(fileStream);
        var filecontent = await streamReader.ReadToEndAsync();
        var credentials = filecontent.Split("|");

        if (credentials.Length != 2) throw new UnauthorizedAccessException("unauthenticated");

        return new() { Username = credentials[0], Password = credentials[1] };
    }

    public static async Task ToLocalFileAsync(Credentials credentials)
    {
        using var fileStream = File.Open("Credentials.ini", FileMode.OpenOrCreate, FileAccess.Write, FileShare.ReadWrite);
        using var streamWriter = new StreamWriter(fileStream);
        await streamWriter.WriteAsync($"{credentials.Username}|{credentials.Password}");
    }

    public string Username { get; set; }
    public string Password { get; set; }
}