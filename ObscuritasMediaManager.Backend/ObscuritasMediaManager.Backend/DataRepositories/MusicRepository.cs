using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MusicRepository
    {
        private readonly DatabaseContext _context;

        public MusicRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task UpdateAsync(string hash, MusicModel old, MusicModel updated)
        {
            var actual = await _context.Music.SingleOrDefaultAsync(x => x.Hash == hash);
            if (actual == default)
                throw new ModelNotFoundException(updated.Hash);

            if (!string.IsNullOrEmpty(updated.Name) && old.Name == actual.Name)
                actual.Name = updated.Name;
            if (!string.IsNullOrEmpty(updated.Author) && old.Author == actual.Author)
                actual.Author = updated.Author;
            if (updated.Genres != null && old.GenreString == actual.GenreString)
                actual.GenreString = updated.GenreString;
            if (updated.Source != null && old.Source == actual.Source)
                actual.Source = updated.Source;
            if (updated.Path != null && old.Path == actual.Path)
                actual.Path = updated.Path;
            if (updated.Mood != default && old.Mood == actual.Mood)
                actual.Mood = updated.Mood;
            if (updated.Instrumentation != default && old.Instrumentation == actual.Instrumentation)
                actual.Instrumentation = updated.Instrumentation;
            if (updated.InstrumentsString != default && old.InstrumentsString == actual.InstrumentsString)
                actual.InstrumentsString = updated.InstrumentsString;
            if (updated.Language != default && old.Language == actual.Language)
                actual.Language = updated.Language;
            if (updated.Nation != default && old.Nation == actual.Nation)
                actual.Nation = updated.Nation;
            if (updated.Participants != default && old.Participants == actual.Participants)
                actual.Participants = updated.Participants;
            if (updated.Rating != 0 && old.Rating == actual.Rating)
                actual.Rating = updated.Rating;
            if (updated.Complete != null)
                actual.Complete = updated.Complete;

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
            var tracks = await GetAllAsync();
            foreach (var track in tracks)
            {
                if (!File.Exists(track.Path)) continue;
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

        public async Task<IEnumerable<MusicModel>> GetAllAsync()
        {
            var response = await _context.Music.ToListAsync();
            return response;
        }

        public async Task BatchCreateMusicTracksAsync(IEnumerable<MusicModel> media)
        {
            await _context.InsertIfNotExistsAsync(media);
        }

        public async Task<IEnumerable<InstrumentModel>> GetInstruments()
        {
            return await _context.Instruments.ToListAsync();
        }
    }
}