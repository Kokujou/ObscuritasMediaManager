using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("MusicInstrumentMapping")]
public class MusicInstrumentMappingModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [MaxLength(250)] public required string TrackHash { get; set; }

    public int InstrumentId { get; set; }
}