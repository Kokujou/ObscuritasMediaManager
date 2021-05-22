using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MusicRepository : IMusicRepository
    {
        public async Task UpdateAsync(string name, string author, MusicModel updated)
        {
            var table = DisposableTableExtension.GetTable<MusicModel>();
            var item = await table.SingleOrDefaultAsync(x => x.Name == name && x.Author == author);
            if (item == default)
                throw new ModelNotFoundException(name, author);

            if (name != updated.Name || author != updated.Author)
            {
                var clone = JsonConvert.DeserializeObject<MusicModel>(
                    JsonConvert.SerializeObject(item));
                table.DeleteOnSubmit(item);
                table.Context.SubmitChanges();
                item = clone;
                if (item == default)
                    throw new ModelNotFoundException(name, author);

                if (!string.IsNullOrEmpty(updated.Name))
                    item.Name = updated.Name;
                if (!string.IsNullOrEmpty(updated.Author))
                    item.Author = updated.Author;
                table.InsertOnSubmit(item);
                table.Context.SubmitChanges();
            }

            if (updated.Genres != null)
                item.Genres = updated.Genres;
            if (updated.Source != null)
                item.Source = updated.Source;
            if (updated.Src != null)
                item.Src = updated.Src;
            if (updated.InstrumentTypes != default)
                item.InstrumentTypes = updated.InstrumentTypes;
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


            table.Context.SubmitChanges();
            await table.DisposeAsync();
        }

        public async Task<MusicModel> GetAsync(string name, string author)
        {
            var table = DisposableTableExtension.GetTable<MusicModel>();
            var response = await table.SingleAsync(x => x.Name == name && x.Author == author);
            await table.DisposeAsync();
            return response;
        }

        public async Task<IEnumerable<MusicModel>> GetAllAsync()
        {
            var table = DisposableTableExtension.GetTable<MusicModel>();
            var response = await table.ToListAsync();
            await table.DisposeAsync();
            return response;
        }

        public async Task BatchCreateMusicTracksAsync(IEnumerable<MusicModel> media)
        {
            var table = DisposableTableExtension.GetTable<MusicModel>();
            table.InsertAllOnSubmit(media);
            table.Context.SubmitChanges(ConflictMode.ContinueOnConflict);
            await table.DisposeAsync();
        }
    }
}