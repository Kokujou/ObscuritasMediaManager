using Newtonsoft.Json;

namespace ObscuritasMediaManager.Backend.Models;

public class StreamingEntryModel
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Season { get; set; }
    public int Episode { get; set; }
    public string Src { get; set; }


    public override string ToString()
    {
        return JsonConvert.SerializeObject(this);
    }
}