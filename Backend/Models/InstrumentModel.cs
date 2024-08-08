using ObscuritasMediaManager.Backend.Data.Music;
using System.ComponentModel.DataAnnotations;

namespace ObscuritasMediaManager.Backend.Models;

public class InstrumentModel
{
    [Key] public int Id { get; set; }
    [MaxLength(255)] public required string Name { get; set; }
    public InstrumentType Type { get; set; }
}