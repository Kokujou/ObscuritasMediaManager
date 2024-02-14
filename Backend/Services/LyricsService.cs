using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Services;

public class LyricsService(IEnumerable<ILyricsClient> lyricsClients)
{
    public async Task<LyricsResponse> SearchForLyricsAsync(MusicModel track, int offset = 0)
    {
        foreach (var client in lyricsClients)
        {
            var links = await client.SearchForAsync(track);
            if (offset < links.Count) return await client.GetRomanizedLyricsAsync(links[offset]);
            offset -= links.Count;
        }

        throw new LyricsNotFoundException("no lyrics found");
    }
}