using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.ClearScript.V8;

namespace ObscuritasMediaManager.Backend.Services;

/// <summary>
///     A custom Http handler for Cloudflare protected servers
/// </summary>
public class CloudflareHttpHandler : HttpClientHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var response = await base.SendAsync(request, cancellationToken);

        if (CookieContainer.GetCookieHeader(request.RequestUri!).Contains("cf_clearance"))
            return response;

        if (!response.Headers.TryGetValues("refresh", out var values) ||
            !values.FirstOrDefault()!.Contains("URL=/cdn-cgi/") ||
            response.Headers.Server.ToString() != "cloudflare-nginx") return response;
        Console.WriteLine("Solving cloudflare challenge . . . ");

        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        var htmlDocument = new HtmlDocument();
        htmlDocument.LoadHtml(content);

        var jschl_vc = htmlDocument.DocumentNode.SelectSingleNode(@".//input[@name=""jschl_vc""]")
            .Attributes["value"].Value;
        var pass = htmlDocument.DocumentNode.SelectSingleNode(@".//input[@name=""pass""]").Attributes["value"]
            .Value;

        var script = htmlDocument.DocumentNode.SelectSingleNode(@".//script").InnerText;

        var regex = new[]
        {
            @"setTimeout\(function\(\){(.+)},\s*\d*\s*\)\s*;",
            @"^\n*\s*(var\s+.*?;)",
            @"(?<=\s+;)(.+t.length;)"
        };

        var function = Regex.Match(script, regex[0], RegexOptions.Singleline).Value;
        var vars = Regex.Match(function, regex[1], RegexOptions.Multiline).Value;
        var calc = Regex.Match(function, regex[2], RegexOptions.Singleline).Value
            .Replace("a.value", "var result")
            .Replace("t.length", request.RequestUri!.Host.Length.ToString());

        object result;
        using (var engine = new V8ScriptEngine())
        {
            result = engine.Evaluate("function getAnswer() {" + vars + calc + "return result;" + "} getAnswer();");
        }

        Thread.Sleep(5000);

        var requestUri = request.RequestUri;

        request.RequestUri = new(requestUri,
            $"cdn-cgi/l/chk_jschl?jschl_vc={jschl_vc}&pass={pass}&jschl_answer={result}");

        await base.SendAsync(request, cancellationToken);

        request.RequestUri = requestUri;

        return await base.SendAsync(request, cancellationToken);
    }
}