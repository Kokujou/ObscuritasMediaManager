using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class MusicRepository(DatabaseContext context)
{
    public async Task UpdatePropertyAsync<T>(string hash, Expression<Func<MusicModel, T>> property, T value)
    {
        await context.Music
            .IgnoreAutoIncludes()
            .Where(x => x.Hash == hash)
            .ExecuteUpdateAsync(property.ToSetPropertyCalls(value));
    }

    public async Task UpdateAsync(string hash, JsonNode old, JsonNode updated, JsonSerializerOptions serializerOptions)
    {
        var actual = await context.Music.AsTracking().SingleOrDefaultAsync(x => x.Hash == hash);
        if (actual == default) throw new ModelNotFoundException(hash);

        if (updated[nameof(MusicModel.Instruments)] is not null)
        {
            var updatedInstruments = updated[nameof(MusicModel.Instruments)]
                .Deserialize<List<InstrumentModel>>(serializerOptions)!;
            var newInstruments = updatedInstruments.Except(actual.Instruments, (a, b) => a.Id == b.Id).ToList();
            var removedInstruments = actual.Instruments.Except(updatedInstruments, (a, b) => a.Id == b.Id).ToList();
            foreach (var added in newInstruments) actual.Instruments.Add(added);
            foreach (var removed in removedInstruments) actual.Instruments.Remove(removed);
            old.AsObject().Remove(nameof(MusicModel.Instruments));
            updated.AsObject().Remove(nameof(MusicModel.Instruments));
        }

        actual.UpdateFromJson(old, updated, serializerOptions);
        await context.SaveChangesAsync();
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
                await context.SaveChangesAsync();
            }
            catch (Exception)
            {
                track.Hash = $"{track.Hash}_{new Random().Next()}";
                await context.SaveChangesAsync();
            }
        }
    }

    public async Task<MusicModel> GetAsync(string hash)
    {
        var response = await context.Music.SingleAsync(x => x.Hash == hash);
        return response;
    }

    public IQueryable<MusicModel> GetAll()
    {
        return context.Music;
    }

    public async Task<ModelCreationState> CreateTrackAsync(MusicModel track)
    {
        try
        {
            var existing = await context.Music.FirstOrDefaultAsync(x => x.Hash == track.Hash);

            if (existing is not null && existing.GetNormalizedPath() == track.GetNormalizedPath())
                return ModelCreationState.Ignored;

            if (existing is not null)
            {
                await UpdatePropertyAsync(track.Hash!, x => x.Path, track.GetNormalizedPath());
                return ModelCreationState.Updated;
            }

            await context.Music.AddAsync(track);
            foreach (var entry in context.ChangeTracker.Entries<InstrumentModel>())
                entry.State = EntityState.Unchanged;
            await context.SaveChangesAsync();
            return ModelCreationState.Success;
        }
        catch (Exception ex) when (ex.InnerException is SqliteException { SqliteExtendedErrorCode : 2067 })
        {
            return ModelCreationState.Ignored;
        }
        catch (Exception ex)
        {
            Log.Error(ex.ToString());
            return ModelCreationState.Error;
        }
    }

    public async Task<IEnumerable<InstrumentModel>> GetInstrumentsAsync()
    {
        return await context.Instruments.ToListAsync();
    }

    public async Task AddInstrumentAsync(InstrumentModel instrument)
    {
        await context.Instruments.AddAsync(instrument);
        await context.SaveChangesAsync();
    }

    public async Task SoftDeleteTracksAsync(IEnumerable<string> trackHashes)
    {
        await context.Music
            .IgnoreAutoIncludes()
            .Where(x => trackHashes.Contains(x.Hash))
            .ExecuteUpdateAsync(builder => builder.SetProperty(x => x.Deleted, x => true));
    }

    public async Task UndeleteTracksAsync(IEnumerable<string> trackHashes)
    {
        await context.Music
            .Where(x => trackHashes.Contains(x.Hash))
            .ExecuteUpdateAsync(builder => builder.SetProperty(x => x.Deleted, x => false));
    }

    public async Task HardDeleteTracksAsync(IEnumerable<string> trackHashes)
    {
        var tracks = await context.Music.Where(x => trackHashes.Contains(x.Hash)).ToListAsync();
        var failedTrackDictionary = new Dictionary<string, string>();
        foreach (var track in tracks)
            try
            {
                if (File.Exists(track.Path))
                    FileSystem.DeleteFile(track.Path, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin);
            }
            catch (Exception ex)
            {
                failedTrackDictionary.Add(track.DisplayName, ex.Message);
            }

        var succeededTrackHashes = trackHashes.Except(failedTrackDictionary.Keys);
        var deleted = await context.Music.IgnoreAutoIncludes().Where(x => succeededTrackHashes.Contains(x.Hash))
            .ExecuteDeleteAsync();

        if (deleted != succeededTrackHashes.Count())
            failedTrackDictionary.Add("Unknown", "Some weird SQL error");

        if (failedTrackDictionary.Count <= 0)
            return;

        var trackReasonString =
            string.Join("\r\n", failedTrackDictionary.Select(x => $"Track: {x.Key}, Reason: {x.Value}"));
        throw new($"The following tracks could not be deleted: \r\n{trackReasonString}");
    }

    public async Task RemoveInstrumentAsync(InstrumentType type, string name)
    {
        context.Instruments.Where(x => x.Type == type && x.Name == name).ExecuteDelete();
        await context.SaveChangesAsync();
    }
}