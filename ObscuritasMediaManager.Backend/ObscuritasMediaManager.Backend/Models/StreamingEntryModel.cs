using Newtonsoft.Json;

namespace ObscuritasMediaManager.Backend.Models
{
    public class StreamingEntryModel
    {
        public string Name { get; set; }
        public string Season { get; set; }
        public int Episode { get; set; }
        public string Src { get; set; }
        public string Type { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}