using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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

        public async Task UpdateAsync(string name, string author, MusicModel updated)
        {
            var item = await _context.Music.SingleOrDefaultAsync(x => x.Name == name && x.Author == author);
            if (item == default)
                throw new ModelNotFoundException(name, author);

            if (name != updated.Name || author != updated.Author)
            {
                var clone = JsonConvert.DeserializeObject<MusicModel>(
                    JsonConvert.SerializeObject(item));
                _context.Remove(item);
                await _context.SaveChangesAsync();
                item = clone;
                if (item == default)
                    throw new ModelNotFoundException(name, author);

                if (!string.IsNullOrEmpty(updated.Name))
                    item.Name = updated.Name;
                if (!string.IsNullOrEmpty(updated.Author))
                    item.Author = updated.Author;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
            }

            if (updated.Genres != null)
                item.GenreString = updated.GenreString;
            if (updated.Source != null)
                item.Source = updated.Source;
            if (updated.Src != null)
                item.Src = updated.Src;
            if (updated.InstrumentTypesString != default)
                item.InstrumentTypesString = updated.InstrumentTypesString;
            if (updated.Mood != default)
                item.Mood = updated.Mood;
            if (updated.Instrumentation != default)
                item.Instrumentation = updated.Instrumentation;
            if (updated.InstrumentsString != default)
                item.InstrumentsString = updated.InstrumentsString;
            if (updated.Language != default)
                item.Language = updated.Language;
            if (updated.Nation != default)
                item.Nation = updated.Nation;
            if (updated.Participants != default)
                item.Participants = updated.Participants;


            await _context.SaveChangesAsync();
        }

        public async Task<MusicModel> GetAsync(string name, string author)
        {
            var response = await _context.Music.SingleAsync(x => x.Name == name && x.Author == author);
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
    }
}