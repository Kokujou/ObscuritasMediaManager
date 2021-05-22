using System.ComponentModel.DataAnnotations;
using System.Data.Linq.Mapping;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "genres")]
    public class GenreModel
    {
        public string Section { get; set; }
        [Key] public string Name { get; set; }
    }
}