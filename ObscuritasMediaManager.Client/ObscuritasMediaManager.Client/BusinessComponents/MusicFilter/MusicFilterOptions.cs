using ObscuritasMediaManager.Backend.Data.Music;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.BusinessComponents.MusicFilter;

public class MusicFilterOptions
{
    public FilterEntry<MusicGenre> genres { get; set; } = new(Enum.GetValues<MusicGenre>(), CheckboxState.Ignore);
    public FilterEntry<Instrumentation> instrumentations
    {
        get;
        set;
    } 
        = 
        new(Enum.GetValues<Instrumentation>(), CheckboxState.Ignore);
    public FilterEntry<string> instruments;
    public FilterEntry<InstrumentType> instrumentTypes { get; set; } = new(Enum.GetValues<InstrumentType>());
    public FilterEntry<Nation> languages { get; set; } = new(Enum.GetValues<Nation>(), CheckboxState.Require);
    public FilterEntry<Mood> moods { get; set; } = new(Enum.GetValues<Mood>(), CheckboxState.Ignore);
    public FilterEntry<Nation> nations { get; set; } = new(Enum.GetValues<Nation>(), CheckboxState.Require);
    public FilterEntry<Participants> participants { get; set; } = new(Enum.GetValues<Participants>(), CheckboxState.Require);
    public FilterEntry<int> ratings { get; set; } = new(new [] { 1, 2, 3, 4, 5 }, CheckboxState.Require);
    public string search { get; set; } = string.Empty;
    public CheckboxState showComplete { get; set; } = CheckboxState.Ignore;
    public CheckboxState showDeleted { get; set; } = CheckboxState.Forbid;
    public CheckboxState showPlaylists { get; set; } = CheckboxState.Ignore;

    public MusicFilterOptions(IEnumerable<string> instrumentNames)
    {
        instruments = new(instrumentNames, CheckboxState.Ignore);
    }
}
