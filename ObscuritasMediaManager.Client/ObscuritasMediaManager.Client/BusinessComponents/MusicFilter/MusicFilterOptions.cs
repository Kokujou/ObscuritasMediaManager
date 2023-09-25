using ObscuritasMediaManager.Backend.Data.Music;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.BusinessComponents.MusicFilter;

public class MusicFilterOptions
{
    public FilterEntry<MusicGenre> genres = new(Enum.GetValues<MusicGenre>(), CheckboxState.Ignore);
    public FilterEntry<Instrumentation> instrumentations = new(Enum.GetValues<Instrumentation>(), CheckboxState.Ignore);
    public FilterEntry<string> instruments = new(Session.instruments.current()?.Select((x) => x.Name)!, CheckboxState.Ignore);
    public FilterEntry<InstrumentType> instrumentTypes = new(Enum.GetValues<InstrumentType>());
    public FilterEntry<Nation> languages = new(Enum.GetValues<Nation>(), CheckboxState.Require);
    public FilterEntry<Mood> moods = new(Enum.GetValues<Mood>(), CheckboxState.Ignore);
    public FilterEntry<Nation> nations = new(Enum.GetValues<Nation>(), CheckboxState.Require);
    public FilterEntry<Participants> participants = new(Enum.GetValues<Participants>(), CheckboxState.Require);
    public FilterEntry<int> ratings = new(new [] { 1, 2, 3, 4, 5 }, CheckboxState.Require);
    public string search = string.Empty;
    public CheckboxState showComplete = CheckboxState.Ignore;
    public CheckboxState showDeleted = CheckboxState.Forbid;
    public CheckboxState showPlaylists = CheckboxState.Ignore;
}
