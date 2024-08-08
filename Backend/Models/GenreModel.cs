using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

public class GenreModel
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();
    [MaxLength(250)] public required string Name { get; set; }
    [NotMapped] [MaxLength(250)] public virtual string SectionName => null!;
}