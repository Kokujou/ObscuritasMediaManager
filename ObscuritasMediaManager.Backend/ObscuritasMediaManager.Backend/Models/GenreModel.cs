using System.ComponentModel.DataAnnotations;

namespace ObscuritasMediaManager.Backend.Models;

public class GenreModel
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();
    public string Section { get; set; }
    public string Name { get; set; }
}