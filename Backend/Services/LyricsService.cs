using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Models;
using ObscuritasMediaManager.Backend.Services.Interfaces;

namespace ObscuritasMediaManager.Backend.Services;

public class LyricsService(IEnumerable<ILyricsClient> lyricsClients)
{
    public async Task<LyricsResponse> SearchForLyricsAsync(MusicModel track, int offset = 0)
    {
        foreach (var client in lyricsClients)
            try
            {
                var links = await client.SearchForAsync(track);
                if (offset < links.Count) return await client.GetRomanizedLyricsAsync(links[offset]);
                offset -= links.Count;
            }
            catch
            {
            }

        throw new LyricsNotFoundException("no lyrics found");
    }
}