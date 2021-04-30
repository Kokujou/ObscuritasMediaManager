using System.Collections.Generic;
using System.Data.Linq;
using System.Data.SQLite;
using System.Linq;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class MediaRepository : IMediaRepository
    {
        private Table<MediaModel> GetTable()
        {
            var connection = new SQLiteConnection("Data Source=database.sqlite");
            connection.Open();
            var context = new DataContext(connection);
            var table = context.GetTable<MediaModel>();
            return table;
        }

        public void UpdateMedia(MediaModel media)
        {
            var table = GetTable();
            var item = table.Single(x => x.Name == media.Name && x.Type == media.Type);

            if (media.Description != null)
                item.Description = media.Description;
            if (media.GenreString != null)
                item.GenreString = media.GenreString;
            if (media.Rating > 0)
                item.Rating = media.Rating;
            if (media.Release > 0)
                item.Release = media.Release;
            if (media.State >= 0)
                item.State = media.State;

            table.Context.SubmitChanges();
            table.Dispose();
        }

        public void AddMediaImage(string mediaName, string mediaType, string mediaImage)
        {
            var table = GetTable();
            var item = table.Single(x => x.Name == mediaName && x.Type == mediaType);
            item.Image = mediaImage;
            table.Context.SubmitChanges();
            table.Dispose();
        }

        public void RemoveMediaImage(string mediaName, string mediaType)
        {
            var table = GetTable();
            var item = table.Single(x => x.Name == mediaName && x.Type == mediaType);
            item.Image = null;
            table.Context.SubmitChanges();
            table.Dispose();
        }


        public MediaModel Get(string name, string type)
        {
            var table = GetTable();
            var response = GetTable().Single(x => x.Name == name && x.Type == type);
            table.Dispose();
            return response;
        }

        public IEnumerable<MediaModel> GetAll(string type = "")
        {
            var table = GetTable();

            if (string.IsNullOrEmpty(type))
                return table.ToList();

            var response = table.Where(x => x.Type == type).ToList();
            table.Dispose();
            return response;
        }

        public void BatchCreateMedia(IEnumerable<MediaModel> media)
        {
            var table = GetTable();
            table.InsertAllOnSubmit(media);
            table.Context.SubmitChanges(ConflictMode.ContinueOnConflict);
            table.Dispose();
        }
    }
}