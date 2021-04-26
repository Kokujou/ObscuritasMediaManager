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
    public class MediaRepository : IMediaRepository
    {
        public void UpdateMedia(MediaModel media)
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite;Cache Size=0");
            connection.Open();

            using var transaction = connection.BeginTransaction();
            using var command = connection.CreateCommand();
            command.CommandText = "update media set ";

            if (media.Description != null)
                command.CommandText += $"Description='{media.Description.ToBase64()}',";
            if (media.GenreString != null)
                command.CommandText += $"Genres='{media.GenreString.ToBase64()}',";
            if (media.Rating > 0)
                command.CommandText += $"Rating={media.Rating},";
            if (media.Release > 0)
                command.CommandText += $"Release='{media.Release}',";
            if (media.State >= 0)
                command.CommandText += $"State='{media.State}',";
            command.CommandText = command.CommandText[..^1];

            command.CommandText += $" where Name='{media.Name.ToBase64()}' and Type='{media.Type.ToBase64()}'";
            command.ExecuteNonQuery();
            transaction.Commit();
        }

        public void AddMediaImage(string mediaName, string mediaType, string mediaImage)
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite;Cache Size=0");
            connection.Open();

            using var transaction = connection.BeginTransaction();
            using var command = connection.CreateCommand();
            command.CommandText =
                $"update media set Image=$value where Name='{mediaName.ToBase64()}' and Type='{mediaType.ToBase64()}'";
            var param = command.CreateParameter();
            param.ParameterName = "$value";
            param.Value = mediaImage;
            command.Parameters.Add(param);
            command.ExecuteNonQuery();
            transaction.Commit();
        }

        public void RemoveMediaImage(string mediaName, string mediaType)
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite;Cache Size=0");
            connection.Open();

            using var transaction = connection.BeginTransaction();
            using var command = connection.CreateCommand();
            command.CommandText =
                $"update media set Image=NULL where Name='{mediaName.ToBase64()}' and Type='{mediaType.ToBase64()}'";
            command.ExecuteNonQuery();
            transaction.Commit();
        }


        public MediaModel Get(string name, string type)
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite;Cache Size=0");
            using var context = new DataContext(connection);
            connection.Open();

            return context.GetTable<MediaModel>()
                .Where(x => x.Name == name.ToBase64() && x.Type == type.ToBase64()).ToList().First();
        }

        public IEnumerable<MediaModel> GetAll(string type = "")
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite;Cache Size=0");
            using var context = new DataContext(connection);
            connection.Open();
            var mediaTable = context.GetTable<MediaModel>();

            if (string.IsNullOrEmpty(type))
                return mediaTable.ToList();

            return mediaTable.Where(x => x.Type == type.ToBase64()).ToList();
        }

        public void BatchCreateMedia(IEnumerable<MediaModel> media)
        {
            using var connection = new SQLiteConnection("Data Source=database.sqlite;Cache Size=0");
            connection.Open();
            using var transaction = connection.BeginTransaction();
            using var command = connection.CreateCommand();

            var failedEntries = new List<MediaModel>();

            foreach (var medium in media)
                try
                {
                    command.CommandText =
                        $"INSERT OR REPLACE INTO Media (Name, Type) VALUES ('{medium.Name.ToBase64()}', '{medium.Type.ToBase64()}')";
                    command.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    failedEntries.Add(medium);
                }

            transaction.Commit();

            if (failedEntries.Count > 0)
                throw new ModelCreationFailedException<MediaModel>(failedEntries);
        }
    }
}