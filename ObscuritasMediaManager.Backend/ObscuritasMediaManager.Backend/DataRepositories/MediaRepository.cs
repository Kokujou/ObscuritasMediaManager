using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Linq;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MediaRepository : IMediaRepository
    {
        public async Task UpdateMediaAsync(string name, string type, MediaModel updated)
        {
            var table = DisposableTableExtension.GetTable<MediaModel>();
            var item = await table.SingleOrDefaultAsync(x => x.Name == name && x.Type == type);
            if (item == default)
                throw new ModelNotFoundException(name, type);

            if (name != updated.Name || type != updated.Type)
            {
                var clone = JsonConvert.DeserializeObject<MediaModel>(JsonConvert.SerializeObject(item));
                table.DeleteOnSubmit(item);
                table.Context.SubmitChanges();
                item = clone;
                if (item == default)
                    throw new ModelNotFoundException(name, type);
                if (!string.IsNullOrEmpty(updated.Name))
                    item.Name = updated.Name;
                if (!string.IsNullOrEmpty(updated.Type))
                    item.Type = updated.Type;
                table.InsertOnSubmit(item);
                table.Context.SubmitChanges();
            }

            if (updated.Description != null)
                item.Description = updated.Description;
            if (updated.GenreString != null)
                item.GenreString = updated.GenreString;
            if (updated.Rating > 0)
                item.Rating = updated.Rating;
            if (updated.Release > 0)
                item.Release = updated.Release;
            if (updated.State >= 0)
                item.State = updated.State;


            table.Context.SubmitChanges();
            await table.DisposeAsync();
        }

        public async Task AddMediaImageAsync(string mediaName, string mediaType, string mediaImage)
        {
            var table = DisposableTableExtension.GetTable<MediaModel>();
            var item = await table.SingleOrDefaultAsync(x => x.Name == mediaName && x.Type == mediaType);
            if (item == default)
                throw new ModelNotFoundException(mediaName, mediaType);
            item.Image = mediaImage;
            table.Context.SubmitChanges();
            await table.DisposeAsync();
        }

        public async Task RemoveMediaImageAsync(string mediaName, string mediaType)
        {
            var table = DisposableTableExtension.GetTable<MediaModel>();
            var item = await table.SingleOrDefaultAsync(x => x.Name == mediaName && x.Type == mediaType);
            if (item == default)
                throw new ModelNotFoundException(mediaName, mediaType);
            item.Image = null;
            table.Context.SubmitChanges();
            await table.DisposeAsync();
        }


        public async Task<MediaModel> GetAsync(string name, string type)
        {
            var table = DisposableTableExtension.GetTable<MediaModel>();
            var response = await table.SingleOrDefaultAsync(x => x.Name == name && x.Type == type);
            if (response == default)
                throw new ModelNotFoundException(name, type);
            await table.DisposeAsync();
            return response;
        }

        public async Task<IEnumerable<MediaModel>> GetAllAsync(string type = "")
        {
            var table = DisposableTableExtension.GetTable<MediaModel>();

            if (string.IsNullOrEmpty(type))
            {
                var media = await table.ToListAsync();
                await table.DisposeAsync();
                return media;
            }

            var response = await table.Where(x => x.Type == type).ToListAsync();
            await table.DisposeAsync();
            return response;
        }

        public async Task BatchCreateMediaAsync(IEnumerable<MediaModel> media)
        {
            var table = DisposableTableExtension.GetTable<MediaModel>();
            table.InsertAllOnSubmit(media);
            table.Context.SubmitChanges(ConflictMode.ContinueOnConflict);
            await table.DisposeAsync();
        }
    }
}