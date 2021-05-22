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

        public async Task<IEnumerable<StreamingEntryModel>> GetAsync(string name, string type)
        {
            var response = await _context.StreamingEntries
                .Where(x => x.Name == name && x.Type == type).ToListAsync();
            return response;
        }

        public async Task<StreamingEntryModel> GetAsync(string name, string type, string season,
            int episode)
        {
            var response = await _context.StreamingEntries.SingleAsync(x => x.Name == name
                                                                            && x.Type == type
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