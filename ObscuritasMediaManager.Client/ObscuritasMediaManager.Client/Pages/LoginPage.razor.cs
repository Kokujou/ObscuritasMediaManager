
using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Client.GenericComponents;

namespace ObscuritasMediaManager.Client.Pages;

public partial class LoginPage
{
    private string username = string.Empty;
    private string password = string.Empty;

    public async Task login()
    {
        try
        {
            var user = await UserRepository.LogonAsync(username, password);
            if (user is null) throw new Exception("unauthorized");
            await Credentials.ToLocalFileAsync(new() { Username = username, Password = password });
            await  Session.InitializeAsync();
            NavigationManager.NavigateTo("/welcome");
        }
        catch
        {
            MessageSnackbar.Popup("Benutzername oder Password sind falsch", MessageSnackbar.Type.Error);
        }
    }
}