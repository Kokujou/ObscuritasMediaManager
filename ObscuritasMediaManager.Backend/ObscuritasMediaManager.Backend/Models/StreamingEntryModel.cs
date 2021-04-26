using System.Data.Linq.Mapping;
using Newtonsoft.Json;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "streaming")]
    public class StreamingEntryModel
    {
        [Column] public string Name { get; set; }
        [Column] public string Season { get; set; }
        [Column] public int Episode { get; set; }
        [Column] public string Src { get; set; }
        [Column] public string Type { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}