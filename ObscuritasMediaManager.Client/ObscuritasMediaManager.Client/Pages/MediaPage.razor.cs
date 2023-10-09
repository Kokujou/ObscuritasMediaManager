using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;
using ObscuritasMediaManager.Client.GenericComponents;
using System;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace ObscuritasMediaManager.Client.Pages;

public partial class MediaPage
{
    public required PaginatedScrolling PaginatedScrolling { get; set; }
    private MediaFilter filter { get; set; }
    private bool loading { get; set; }
    private List<GenreModel> genreList { get; set; } = new();

    private List<MediaModel> paginatedMedia => filteredMedia.Take(10 + (4 * currentPage)).ToList();

    private List<MediaModel> filteredMedia => MediaFilterService.filter(Session.mediaList.Current, filter);

    private int currentPage { get; set; } = 0;

    protected override async Task OnInitializedAsync()
    {
        loading = true;
        await InitializeAsync();

        Subscriptions.AddRange(Session.UserSettings
                .Subscribe(x =>
                        {
                            try
                            {
                                var newFilter = JsonSerializer.Deserialize<MediaFilter>(x.newValue?.MediaFilter ?? string.Empty);
                                if (newFilter is not null) filter = newFilter;
                            }
                            catch { }
                        }),
        Session.mediaList.Subscribe(x => StateHasChanged()));
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);
        if (!firstRender) return;
    }

    private async Task InitializeAsync()
    {
        var genres = await GenreRepository.GetAll().ToListAsync();
        filter = new MediaFilter();
        filter.UpdateGenres(genres.Select(x => x.Id));
        loading = false;
    }

    private async Task changePropertyOf<T>(MediaModel mediaModel, Expression<Func<MediaModel, T>> expression, T value)
    {
        await MediaRepository.UpdatePropertyAsync(mediaModel.Id, expression, value);
        ((PropertyInfo)((MemberExpression)expression.Body).Member).SetValue(mediaModel, value);
    }

    private async Task UpdateFilter(MediaFilter filter)
    {
        try
        {
            var serialized = JsonSerializer.Serialize(filter);
            await UserRepository.UpdateUserSettingsAsync(Session.UserSettings.Current.Id,
            x => x.SetProperty(y => y.MediaFilter, serialized));
            Session.UserSettings.Current.MediaFilter = serialized;
            Session.UserSettings.Next(Session.UserSettings.Current);
        }
        catch (Exception ex) { }
    }
}
