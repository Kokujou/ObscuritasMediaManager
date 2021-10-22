using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MediaRepository
    {
        private readonly DatabaseContext _context;

        public MediaRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task UpdateMediaAsync(MediaModel updated)
        {
            var item = await _context.Media.SingleOrDefaultAsync(x => x.Id == updated.Id);

            if (item == default)
                throw new ModelNotFoundException(updated.Id);

            if (!string.IsNullOrEmpty(updated.Name))
                item.Name = updated.Name;
            if (!string.IsNullOrEmpty(updated.Type))
                item.Type = updated.Type;
            if (updated.Description != null)
                item.Description = updated.Description;
            if (updated.Genres != null)
                item.Genres = updated.Genres;
            if (updated.Rating > 0)
                item.Rating = updated.Rating;
            if (updated.Release > 0)
                item.Release = updated.Release;
            if (updated.State >= 0)
                item.State = updated.State;

            await _context.SaveChangesAsync();
        }

        public async Task AddMediaImageAsync(Guid guid, string mediaImage)
        {
            var item = await _context.Media.SingleOrDefaultAsync(x => x.Id == guid);
            if (item == default)
                throw new ModelNotFoundException(guid);
            item.Image = mediaImage;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveMediaImageAsync(Guid guid)
        {
            var item = await _context.Media.SingleOrDefaultAsync(x => x.Id == guid);
            if (item == default)
                throw new ModelNotFoundException(guid);
            item.Image = null;
            await _context.SaveChangesAsync();
        }

        public async Task<MediaModel> GetAsync(Guid guid)
        {
            var response = await _context.Media.SingleOrDefaultAsync(x => x.Id == guid);
            if (response == default)
                throw new ModelNotFoundException(guid);
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