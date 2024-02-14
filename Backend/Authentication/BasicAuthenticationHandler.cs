using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace ObscuritasMediaManager.Backend.Authentication;

public class BasicAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    UserRepository userRepository)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var cookie = Request.Headers.Cookie.GetCookie("Authorization");
        if (cookie is null) return AuthenticateResult.Fail("invalid auth header");

        var token = cookie["Basic ".Length..].Split(";")[0];
        var decoded = token.FromBase64String();
        if (decoded is null) return AuthenticateResult.Fail("token could not be decoded");

        var colonCount = decoded.Count(x => x == ':');
        if (colonCount != 1) return AuthenticateResult.Fail("decoded token must contain exactly one colon (:)");

        var split = decoded.Split(":");
        var username = split[0];
        var password = split[1];

        var user = await userRepository.LogonAsync(username, password);
        if (user is null) return AuthenticateResult.Fail("wrong combination of username and password");

        return AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(user), "basic"));
    }
}