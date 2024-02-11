using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

public class GenreModel
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    [NotMapped] public string SectionName { get; set; }
}
