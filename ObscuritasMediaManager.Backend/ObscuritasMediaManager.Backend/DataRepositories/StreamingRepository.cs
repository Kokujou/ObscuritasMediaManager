using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class StreamingRepository : IStreamingRepository
    {
        private readonly DatabaseContext _context;

        public StreamingRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task BatchCreateStreamingEntriesAsync(IEnumerable<StreamingEntryModel> streamingEntries)
        {
            await _context.InsertIfNotExistsAsync(streamingEntries);
        }

        public async Task<IEnumerable<StreamingEntryModel>> GetAsync(Guid guid)
        {
            var response = await _context.StreamingEntries
                .Where(x => x.Id == guid).ToListAsync();
            return response;
        }

        public async Task<StreamingEntryModel> GetAsync(Guid guid, string season,
            int episode)
        {
            var response = await _context.StreamingEntries.SingleAsync(x => x.Id == guid
                                                                            && x.Season == season
                                                                            && x.Episode == episode);
            return response;
        }

        public async ValueTask DisposeAsync()
        {
            await _context.DisposeAsync();
        }
    }
}