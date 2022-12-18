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
            if (property.ClrType.BaseType != typeof(Enum)) continue;
            var type = typeof(EnumToStringConverter<>).MakeGenericType(property.ClrType);
            var converter = Activator.CreateInstance(type, new ConverterMappingHints()) as ValueConverter;

            property.SetValueConverter(converter);
        }
    }
}