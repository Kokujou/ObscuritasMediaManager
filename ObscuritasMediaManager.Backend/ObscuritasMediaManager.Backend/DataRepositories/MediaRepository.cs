using System.Collections.Generic;
using System.Data.Linq;
using System.Data.SQLite;
using System.Linq;
using Newtonsoft.Json;
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

        public void UpdateMedia(string name, string type, MediaModel updated)
        {
            var table = GetTable();
            var item = table.Single(x => x.Name == name && x.Type == type);

            if (name != updated.Name || type != updated.Type)
            {
                var clone = JsonConvert.DeserializeObject<MediaModel>(JsonConvert.SerializeObject(item));
                table.DeleteOnSubmit(item);
                table.Context.SubmitChanges();
                item = clone;
                if (!string.IsNullOrEmpty(updated.Name))
                    item.Name = updated.Name;
                if (!string.IsNullOrEmpty(updated.Type))
                    item.Type = updated.Type;
                table.InsertOnSubmit(item);
                table.Context.SubmitChanges();
            }

            if (updated.Description != null)
                item.Description = updated.Description;
            if (updated.GenreString != null)
                item.GenreString = updated.GenreString;
            if (updated.Rating > 0)
                item.Rating = updated.Rating;
            if (updated.Release > 0)
                item.Release = updated.Release;
            if (updated.State >= 0)
                item.State = updated.State;


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