using System.Collections.Generic;
using System.Data.Linq;
using System.Data.SQLite;
using System.Linq;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MediaRepository : IMediaRepository
    {
        private readonly SQLiteConnection _connection;
        private readonly DataContext _context;

        public MediaRepository()
        {
            _connection = new SQLiteConnection("Data Source=database.sqlite");
            _context = new DataContext(_connection);
            _connection.Open();
        }

        public MediaModel Get(string name, string type)
        {
            return _context.GetTable<MediaModel>().First(x => x.Name == name && x.Type == type);
        }

        public IEnumerable<MediaModel> GetAll(string type = "")
        {
            var mediaTable = _context.GetTable<MediaModel>();

            if (string.IsNullOrEmpty(type)) return mediaTable.ToList();

            return mediaTable.Where(x => x.Type == type).ToList();
        }

        public void BatchCreateMedia(IEnumerable<MediaModel> media)
        {
            using var transaction = _connection.BeginTransaction();
            var command = _connection.CreateCommand();

// Insert a lot of data
            foreach (var item in media)
            {
                command.CommandText = $"INSERT INTO Media (Name, Type) VALUES ('{item.Name}', '{item.Type}')";
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