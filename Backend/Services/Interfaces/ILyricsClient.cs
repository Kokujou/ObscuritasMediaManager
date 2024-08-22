using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Services.Interfaces;

public interface ILyricsClient
{
    Task<List<LyricsSearchResponse>> SearchForAsync(MusicModel track);
    Task<LyricsResponse> GetRomanizedLyricsAsync(LyricsSearchResponse target);
}