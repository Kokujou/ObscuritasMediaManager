using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class ContextConfigurationExtensions
{
    public static void AddEnumConversion(this ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        foreach (var property in entityType.GetProperties())
        {
            var propertyType = property.ClrType;
            if ((!propertyType.IsEnum && !(Nullable.GetUnderlyingType(propertyType)?.IsEnum ?? false)) ||
                entityType.IsOwned())
                continue;
            property.SetValueConverter(typeof(EnumToStringConverter<>).MakeGenericType(propertyType));
        }
    }
}