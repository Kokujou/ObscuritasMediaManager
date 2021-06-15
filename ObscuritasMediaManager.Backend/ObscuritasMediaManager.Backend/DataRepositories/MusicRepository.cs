using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MusicRepository : IMusicRepository
    {
        private readonly DatabaseContext _context;

        public MusicRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task UpdateAsync(MusicModel updated)
        {
            var item = await _context.Music.SingleOrDefaultAsync(x => x.Id == updated.Id);
            if (item == default)
                throw new ModelNotFoundException(updated.Id);

            if (!string.IsNullOrEmpty(updated.Name))
                item.Name = updated.Name;
            if (!string.IsNullOrEmpty(updated.Author))
                item.Author = updated.Author;
            if (updated.Genres != null)
                item.GenreString = updated.GenreString;
            if (updated.Source != null)
                item.Source = updated.Source;
            if (updated.Src != null)
                item.Src = updated.Src;
            if (updated.Mood != default)
                item.Mood = updated.Mood;
            if (updated.Instrumentation != default)
                item.Instrumentation = updated.Instrumentation;
            if (updated.Instruments != default)
                item.Instruments = updated.Instruments;
            if (updated.Language != default)
                item.Language = updated.Language;
            if (updated.Nation != default)
                item.Nation = updated.Nation;
            if (updated.Participants != default)
                item.Participants = updated.Participants;

            await _context.SaveChangesAsync();
        }

        public async Task<MusicModel> GetAsync(Guid guid)
        {
            var response = await _context.Music.SingleAsync(x => x.Id == guid);
            return response;
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