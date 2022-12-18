using System.ComponentModel.DataAnnotations;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Backend.Models;

public class InstrumentModel
{
    [Key] public string Name { get; set; }
    public InstrumentType Type { get; set; }
}