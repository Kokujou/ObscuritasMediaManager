using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Food;
using System.ComponentModel.DataAnnotations;

namespace ObscuritasMediaManager.Backend.Models;

[Owned]
public record MeasurementUnit
{
    [MaxLength(255)] public required string Name { get; set; }
    [MaxLength(10)] public required string ShortName { get; set; }
    public float Multiplier { get; set; }
    public Measurement Measurement { get; set; }
}