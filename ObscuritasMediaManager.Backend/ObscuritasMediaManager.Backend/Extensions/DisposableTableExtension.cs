using System.Data.Linq;
using System.Data.SQLite;
using System.Threading.Tasks;

namespace ObscuritasMediaManager.Backend.Extensions
{
    public static class DisposableTableExtension
    {
        public static async Task DisposeAsync<T>(this Table<T> table) where T : class
        {
            await table.Context.Connection.DisposeAsync();
            table.Context.Dispose();
        }

        public static Table<T> GetTable<T>() where T : class
        {
            var connection = new SQLiteConnection("Data Source=database.sqlite");
            connection.Open();
            var context = new DataContext(connection);
            var table = context.GetTable<T>();
            return table;
        }
    }
}