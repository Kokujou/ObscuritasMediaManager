using System.Collections.Generic;
using System.Data.Linq;
using System.Data.SQLite;
using System.Linq;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class StreamingRepository : IStreamingRepository
    {
        private Table<StreamingEntryModel> GetTable()
        {
            var connection = new SQLiteConnection("Data Source=database.sqlite");
            connection.Open();
            var context = new DataContext(connection);
            var table = context.GetTable<StreamingEntryModel>();
            return table;
        }

        public void BatchCreateStreamingEntries(IEnumerable<StreamingEntryModel> streamingEntries)
        {
            var table = GetTable();
            table.InsertAllOnSubmit(streamingEntries);
            table.Context.SubmitChanges(ConflictMode.ContinueOnConflict);
            table.Dispose();
        }

        public IEnumerable<StreamingEntryModel> Get(string name, string type)
        {
            var table = GetTable();

            var response = table.Where(x => x.Name == name && x.Type == type).ToList();
            table.Dispose();
            return response;
        }

        public IEnumerable<StreamingEntryModel> Get(string name, string type, string season, int episode)
        {
            var table = GetTable();
            var response = table.Where(x => x.Name == name && x.Type == type && x.Season == season &&
                                            x.Episode == episode).ToList();
            table.Dispose();
            return response;
        }
    }
}