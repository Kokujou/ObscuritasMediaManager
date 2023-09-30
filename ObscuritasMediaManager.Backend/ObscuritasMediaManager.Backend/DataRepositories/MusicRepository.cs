using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.VisualBasic.FileIO;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Linq;
using System.Linq.Expressions;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class MusicRepository
{
    private readonly DatabaseContext _context;

    public MusicRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task UpdateAsync(string hash,
        Expression<Func<SetPropertyCalls<MusicModel>, SetPropertyCalls<MusicModel>>> setCalls)
    {
        await _context.Music.Where(x => x.Hash == hash).ExecuteUpdateAsync(setCalls);
    }

    public async Task UpdateAsync(string hash, JsonElement old, JsonElement updated, JsonSerializerOptions serializerOptions)
    {
        var actual = await _context.Music.AsTracking().SingleOrDefaultAsync(x => x.Hash == hash);
        if (actual == default) throw new ModelNotFoundException(hash);

        actual.UpdateFromJson(old, updated, serializerOptions);
        await _context.SaveChangesAsync();
    }

    public async Task ChangeFilePathAsync(string hash, string newPath)
    {
        var actual = await _context.Music.AsTracking().SingleOrDefaultAsync(x => x.Hash == hash);
        actual.Path = newPath;
        await _context.SaveChangesAsync();
    }

    public async Task RecalculateHashesAsync()
    {
        var tracks = GetAll();
        foreach (var track in tracks)
        {
            if (!File.Exists(track.Path))
                continue;
            track.CalculateHash();
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                track.Hash = $"{track.Hash}_{new Random().Next()}";
                await _context.SaveChangesAsync();
            }
        }
    }

    public async Task<MusicModel> GetAsync(string hash)
    {
        var response = await _context.Music.SingleAsync(x => x.Hash == hash);
        return response;
    }

    public async Task<Dictionary<string, string>> GetHashValuesAsync()
    {
        return await _context.Music.ToDictionaryAsync(x => x.Hash, x => x.Path);
    }

    public IQueryable<MusicModel> GetAll()
    {
        return _context.Music;
    }

    public async Task<IEnumerable<MusicModel>> GetSelectedAsync(IEnumerable<string> trackHashes)
    {
        var query = await _context.Music.Where(track => trackHashes.Contains(track.Hash)).ToListAsync();
        return query;
    }

    public async Task BatchCreateMusicTracksAsync(IEnumerable<MusicModel> media)
    {
        var errors = new Dictionary<MusicModel, string>();
        await Task.WhenAll(media.Select(track => Task.Run(() =>
                    {
                        try
                        {
                            _context.Music.Add(track);
                            _context.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            errors.Add(track, ex.ToString());
                        }
                    })));
        if (errors.Count > 0) throw new ModelCreationFailedException<MusicModel>(errors);
    }

    public async Task<IEnumerable<InstrumentModel>> GetInstrumentsAsync()
    {
        return await _context.Instruments.ToListAsync();
    }

    public async Task AddInstrumentAsync(InstrumentModel instrument)
    {
        await _context.Instruments.AddAsync(instrument);
        await _context.SaveChangesAsync();
    }

    public async Task SoftDeleteTracksAsync(IEnumerable<string> trackHashes)
    {
        await _context.Music
            .Where(x => trackHashes.Contains(x.Hash))
            .ExecuteUpdateAsync(builder => builder.SetProperty(x => x.Deleted, x => true));
    }

    public async Task UndeleteTracksAsync(IEnumerable<string> trackHashes)
    {
        await _context.Music
            .Where(x => trackHashes.Contains(x.Hash))
            .ExecuteUpdateAsync(builder => builder.SetProperty(x => x.Deleted, x => false));
    }

    public async Task HardDeleteTracksAsync(IEnumerable<string> trackHashes)
    {
        var tracks = await _context.Music.Where(x => trackHashes.Contains(x.Hash)).ToListAsync();
        var failedTrackDictionary = new Dictionary<string, string>();
        foreach (var track in tracks)
            try
            {
                FileSystem.DeleteFile(track.Path, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin);
            }
            catch (Exception ex)
            {
                failedTrackDictionary.Add(track.DisplayName, ex.Message);
            }

        var succeededTrackHashes = trackHashes.Except(failedTrackDictionary.Keys);
        var deleted = await _context.Music.Where(x => succeededTrackHashes.Contains(x.Hash)).ExecuteDeleteAsync();

        if (deleted != succeededTrackHashes.Count())
            failedTrackDictionary.Add("Unknown", "Some weird SQL error");

        if (failedTrackDictionary.Count <= 0)
            return;

        var trackReasonString = string.Join("\r\n", failedTrackDictionary.Select(x => $"Track: {x.Key}, Reason: {x.Value}"));
        throw new Exception($"The following tracks could not be deleted: \r\n{trackReasonString}");
    }

    public async Task RemoveInstrumentAsync(InstrumentType type, string name)
    {
        _context.Instruments.Remove(new() { Name = name, Type = type });
        await _context.SaveChangesAsync();
    }
}