using System.Data.Linq;

namespace ObscuritasMediaManager.Backend.Extensions
{
    public static class DisposableTableExtension
    {
        public static void Dispose<T>(this Table<T> table) where T : class
        {
            table.Context.Connection.Dispose();
            table.Context.Dispose();
        }
    }
}