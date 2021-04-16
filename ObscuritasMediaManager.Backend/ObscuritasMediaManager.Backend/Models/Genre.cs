using System.Data.Linq.Mapping;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "genres")]
    public class Genre
    {
        [Column(Name = "section")] public string Section { get; set; }
        [Column(Name = "name")] public string Name { get; set; }
    }
}