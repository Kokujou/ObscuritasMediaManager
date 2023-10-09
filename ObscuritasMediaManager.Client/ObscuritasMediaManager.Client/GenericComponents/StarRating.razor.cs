using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class StarRating
{
    [Parameter] public int max { get; set; } = 5;
    [Parameter] public List<int> values { get; set; } = new List<int>();
    [Parameter] public bool singleSelect { get; set; }
    [Parameter] public bool vertical { get; set; }
    [Parameter] public bool swords { get; set; }
    [Parameter] public EventCallback<(int rating, bool include)> ratingChanged { get; set; }
    private int hoveredRating = -1;

    public void toggleRating(int rating)
    {
        var include = true;

        if (singleSelect)
            values = Enumerable.Range(1, rating).ToList();
        else if (values.Contains(rating))
        {
            values = values.Where((x) => x != rating).ToList();
            include = false;
        }
        else
            values.Add(rating);

        ratingChanged.InvokeAsync((rating, include));
    }
}