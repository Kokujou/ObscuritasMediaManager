using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public class FilterEntry<T> where T : notnull
{
    public Dictionary<T, CheckboxState>   states = new();

    public IEnumerable<T> forbidden => states.Where((x) => x.Value == CheckboxState.Forbid).Select((x) => x.Key);

    public IEnumerable<T> ignored => states.Where((x) => x.Value == CheckboxState.Ignore).Select((x) => x.Key);

    public IEnumerable<T> required => states.Where((x) => x.Value == CheckboxState.Require).Select((x) => x.Key);

    public FilterEntry(IEnumerable<T> values, CheckboxState defaultValue = CheckboxState.Ignore)
    {
        states = values.ToDictionary(x => x, x => defaultValue);
    }

    public void ChangeAll(CheckboxState target)
    {
        foreach (var state in states) states[state.Key] = target;
    }
}
