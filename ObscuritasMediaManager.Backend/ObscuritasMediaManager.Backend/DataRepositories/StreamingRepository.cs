using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Linq;
using System.Linq;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class StreamingRepository : IStreamingRepository
    {
        public async Task BatchCreateStreamingEntriesAsync(IEnumerable<StreamingEntryModel> streamingEntries)
        {
            var table = DisposableTableExtension.GetTable<StreamingEntryModel>();
            table.InsertAllOnSubmit(streamingEntries);
            table.Context.SubmitChanges(ConflictMode.ContinueOnConflict);
            await table.DisposeAsync();
        }

        public async Task<IEnumerable<StreamingEntryModel>> GetAsync(string name, string type)
        {
            var table = DisposableTableExtension.GetTable<StreamingEntryModel>();

            var response = await table.Where(x => x.Name == name && x.Type == type).ToListAsync();
            await table.DisposeAsync();
            return response;
        }

        public async Task<StreamingEntryModel> GetAsync(string name, string type, string season,
            int episode)
        {
            var table = DisposableTableExtension.GetTable<StreamingEntryModel>();
            var response = await table.SingleAsync(x => x.Name == name
                                                        && x.Type == type
                                                        && x.Season == season
                                                        && x.Episode == episode);
            await table.DisposeAsync();
            return response;
        }
    }
}