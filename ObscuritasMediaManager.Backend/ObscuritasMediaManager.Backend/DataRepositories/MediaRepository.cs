using System.Collections.Generic;
using System.Data.SQLite;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MediaRepository : IMediaRepository
    {
        private readonly SQLiteConnection _connection;

        public MediaRepository()
        {
            _connection = new SQLiteConnection("Data Source=database.sqlite");
            _connection.Open();
        }

        public void BatchCreateMedia(IEnumerable<MediaModel> media)
        {
            using var transaction = _connection.BeginTransaction();
            var command = _connection.CreateCommand();
            command.CommandText = @"INSERT INTO Media (Name, Type) VALUES ($name, $type)";

            var nameParam = command.CreateParameter();
            nameParam.ParameterName = "$name";
            var typeParam = command.CreateParameter();
            typeParam.ParameterName = "$type";
            command.Parameters.Add(nameParam);
            command.Parameters.Add(typeParam);

            // Insert a lot of data
            foreach (var item in media)
            {
                nameParam.Value = item.Name;
                typeParam.Value = item.Type;
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