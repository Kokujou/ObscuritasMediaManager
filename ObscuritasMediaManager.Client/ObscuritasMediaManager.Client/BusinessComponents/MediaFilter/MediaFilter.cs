using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Client.Converters;
using System;
using System.Linq;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;

public class MediaFilter
{
    public static readonly List<(Expression<Func<MediaModel, object>> Property, string Translation)> SortableProperties = new()
    {
        (  x => x.Name,  "Name" ),
        (  x => x.Release, "Release" ),
        (  x => x.Rating, "Bewertung" ),
    };

    public FilterEntry<MediaCategory> Category { get; set; } = new(Enum.GetValues<MediaCategory>(), CheckboxState.Ignore);
    public FilterEntry<ContentWarning> ContentWarnings
    {
        get;
        set;
    } = new(Enum.GetValues<ContentWarning>(), CheckboxState.Ignore);
    public FilterEntry<Guid> Genres { get; set; } = new(new List<Guid>());
    public FilterEntry<Nation> Languages { get; set; } = new(Enum.GetValues<Nation>(), CheckboxState.Require);
    public FilterEntry<int> Ratings { get; set; } = new(new[] { 1, 2, 3, 4, 5 }, CheckboxState.Require);
    public (int? min, int? max) Release { get; set; } = (min: null, max: null);
    public string Search { get; set; } = string.Empty;
    public SortDirection? SortingDirection { get; set; } = SortDirection.Ascending;
    [JsonConverter(typeof(ExpressionJsonConverter))]
    public Expression<Func<MediaModel, object>>? SortingPropertyExpression { get; set; } = null;
    public FilterEntry<MediaStatus> Status { get; set; } = new(Enum.GetValues<MediaStatus>(), CheckboxState.Ignore);
    public FilterEntry<TargetGroup> TargetGroups { get; set; } = new(Enum.GetValues<TargetGroup>(), CheckboxState.Ignore);

    public void UpdateGenres(IEnumerable<Guid> genres)
    {
        Genres.states = genres.ToDictionary(x => x, id =>
            {
                if (Genres.states.ContainsKey(id)) return Genres.states[id];
                return CheckboxState.Ignore;
            });
    }
}
