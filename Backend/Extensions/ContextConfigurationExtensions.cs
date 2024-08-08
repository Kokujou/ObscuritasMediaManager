using Microsoft.EntityFrameworkCore;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class ContextConfigurationExtensions
{
    public static void AddEnumConversion(this ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        foreach (var property in entityType.GetProperties())
        {
            var propertyType = property.ClrType;
            if (!propertyType.IsEnum && !(Nullable.GetUnderlyingType(propertyType)?.IsEnum ?? false))
                continue;

            modelBuilder
                .Entity(entityType.ClrType)
                .Property(property.Name)
                .HasConversion<string>();
        }
    }
}