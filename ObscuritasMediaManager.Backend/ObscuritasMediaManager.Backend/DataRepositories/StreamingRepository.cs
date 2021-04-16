using System.Collections.Generic;
using System.Data.SQLite;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class StreamingRepository : IStreamingRepository
    {
        private readonly SQLiteConnection _connection;

        public StreamingRepository()
        {
            _connection = new SQLiteConnection("Data Source=database.sqlite");
            _connection.Open();
        }

        public void BatchCreateStreamingEntries(IEnumerable<StreamingEntryModel> streamingEntries)
        {
            using var transaction = _connection.BeginTransaction();
            var command = _connection.CreateCommand();

            // Insert a lot of data
            foreach (var item in streamingEntries)
            {
                command.CommandText =
                    "INSERT INTO Streaming (Name, Season, Episode, Src, Type) " +
                    $"VALUES ('{item.Name}', '{item.Season}', '{item.Episode}', '{item.Src}', '{item.Type}')";
                command.ExecuteNonQuery();
            }

            transaction.Commit();
        }

        public void Dispose()
        {
            _connection.Dispose();
        }
    }
}