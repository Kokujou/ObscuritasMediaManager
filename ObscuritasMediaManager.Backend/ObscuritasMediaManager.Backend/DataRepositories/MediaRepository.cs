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

        public void UpdateMedia(MediaModel media)
        {
            using var transaction = _connection.BeginTransaction();
            var command = _connection.CreateCommand();
            command.CommandText = "update media set ";

            if (media.Description != null)
                command.CommandText += $"Description='{media.Description}',";
            if (media.GenreString != null)
                command.CommandText += $"Genres='{media.GenreString}',";
            if (media.Rating > 0)
                command.CommandText += $"Rating={media.Rating},";
            if (media.Release > 0)
                command.CommandText += $"Release='{media.Release}',";
            if (media.State >= 0)
                command.CommandText += $"State='{media.State}',";
            command.CommandText = command.CommandText[..^1];

            command.CommandText += $" where Name='{media.Name}' and Type='{media.Type}'";
            command.ExecuteNonQuery();
            transaction.Commit();
        }

        public void AddMediaImage(string mediaName, string mediaType, string mediaImage)
        {
            using var transaction = _connection.BeginTransaction();
            var command = _connection.CreateCommand();
            command.CommandText = $"update media set Image=$value where Name='{mediaName}' and Type='{mediaType}'";
            var param = command.CreateParameter();
            param.ParameterName = "$value";
            param.Value = mediaImage;
            command.Parameters.Add(param);
            command.ExecuteNonQuery();
            transaction.Commit();
        }

        public void RemoveMediaImage(string mediaName, string mediaType)
        {
            using var transaction = _connection.BeginTransaction();
            var command = _connection.CreateCommand();
            command.CommandText = $"update media set Image=NULL where Name='{mediaName}' and Type='{mediaType}'";
            command.ExecuteNonQuery();
            transaction.Commit();
        }


        public MediaModel Get(string name, string type)
        {
            return _context.GetTable<MediaModel>().Where(x => x.Name == name && x.Type == type).ToList().First();
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