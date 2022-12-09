using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Backend.Authentication;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly UserRepository _userRepository;

    public BasicAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger,
        UrlEncoder encoder, ISystemClock clock, UserRepository userRepository) : base(options, logger, encoder, clock)
    {
        _userRepository = userRepository;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var cookie = Request.Headers.Cookie.GetCookie("Authorization");
        if (cookie is null) return AuthenticateResult.Fail("invalid auth header");

        var token = cookie["Basic ".Length..];
        var decoded = token.FromBase64String();
        if (decoded is null) return AuthenticateResult.Fail("token could not be decoded");

        var colonCount = decoded.Count(x => x == ':');
        if (colonCount != 1) return AuthenticateResult.Fail("decoded token must contain exactly one colon (:)");

        var split = decoded.Split(":");
        var username = split[0];
        var password = split[1];

        var user = await _userRepository.LogonAsync(username, password);
        if (user is null) return AuthenticateResult.Fail("wrong combination of username and password");

        return AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(user), "basic"));
    }
}