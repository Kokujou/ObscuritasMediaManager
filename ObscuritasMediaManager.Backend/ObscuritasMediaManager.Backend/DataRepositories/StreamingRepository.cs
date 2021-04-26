using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Data.SQLite;
using System.Linq;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class StreamingRepository : IStreamingRepository
    {
        public void BatchCreateStreamingEntries(IEnumerable<StreamingEntryModel> streamingEntries)
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite");
            connection.Open();
            using var transaction = connection.BeginTransaction();
            using var command = connection.CreateCommand();

            var failedEntries = new List<StreamingEntryModel>();

            foreach (var entry in streamingEntries)
                try
                {
                    command.CommandText =
                        "INSERT OR REPLACE INTO Streaming (Name, Season, Episode, Src, Type) " +
                        $"VALUES ('{entry.Name.ToBase64()}', '{entry.Season.ToBase64()}', '{entry.Episode}', '{entry.Src.ToBase64()}', '{entry.Type}')";
                    command.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                    failedEntries.Add(entry);
                }

            transaction.Commit();

            if (failedEntries.Count > 0)
                throw new ModelCreationFailedException<StreamingEntryModel>(failedEntries);
        }

        public IEnumerable<StreamingEntryModel> Get(string name, string type)
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite");
            connection.Open();
            using var context = new DataContext(connection);

            return context.GetTable<StreamingEntryModel>()
                .Where(x => x.Name == name.ToBase64() && x.Type == type).ToList();
        }
    }
}