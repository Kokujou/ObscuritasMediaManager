using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MediaRepository : IMediaRepository
    {
        private readonly DatabaseContext _context;

        public MediaRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task UpdateMediaAsync(string name, string type, MediaModel updated)
        {
            var item = await _context.Media.SingleOrDefaultAsync(x => x.Name == name && x.Type == type);
            if (item == default)
                throw new ModelNotFoundException(name, type);

            if (name != updated.Name || type != updated.Type)
            {
                var clone = JsonConvert.DeserializeObject<MediaModel>(JsonConvert.SerializeObject(item));
                _context.Remove(item);
                await _context.SaveChangesAsync();
                item = clone;
                if (item == default)
                    throw new ModelNotFoundException(name, type);
                if (!string.IsNullOrEmpty(updated.Name))
                    item.Name = updated.Name;
                if (!string.IsNullOrEmpty(updated.Type))
                    item.Type = updated.Type;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
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

            await _context.SaveChangesAsync();
        }

        public async Task AddMediaImageAsync(string mediaName, string mediaType, string mediaImage)
        {
            var item = await _context.Media.SingleOrDefaultAsync(x => x.Name == mediaName && x.Type == mediaType);
            if (item == default)
                throw new ModelNotFoundException(mediaName, mediaType);
            item.Image = mediaImage;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveMediaImageAsync(string mediaName, string mediaType)
        {
            var item = await _context.Media.SingleOrDefaultAsync(x => x.Name == mediaName && x.Type == mediaType);
            if (item == default)
                throw new ModelNotFoundException(mediaName, mediaType);
            item.Image = null;
            await _context.SaveChangesAsync();
        }


        public async Task<MediaModel> GetAsync(string name, string type)
        {
            var response = await _context.Media.SingleOrDefaultAsync(x => x.Name == name && x.Type == type);
            if (response == default)
                throw new ModelNotFoundException(name, type);
            return response;
        }

        public async Task<IEnumerable<MediaModel>> GetAllAsync(string type = "")
        {
            if (string.IsNullOrEmpty(type)) return await _context.Media.ToListAsync();

            var response = await _context.Media.Where(x => x.Type == type).ToListAsync();
            return response;
        }

        public async Task BatchCreateMediaAsync(IEnumerable<MediaModel> media)
        {
            await _context.InsertIfNotExistsAsync(media);
        }

        public async ValueTask DisposeAsync()
        {
            await _context.DisposeAsync();
        }
    }
}