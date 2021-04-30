using System.Data.Linq.Mapping;
using Newtonsoft.Json;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "streaming")]
    public class StreamingEntryModel
    {
        [Column(IsPrimaryKey = true)] public string Name { get; set; }
        [Column(IsPrimaryKey = true)] public string Type { get; set; }
        [Column(IsPrimaryKey = true)] public string Season { get; set; }
        [Column(IsPrimaryKey = true)] public int Episode { get; set; }
        [Column] public string Src { get; set; }


        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}