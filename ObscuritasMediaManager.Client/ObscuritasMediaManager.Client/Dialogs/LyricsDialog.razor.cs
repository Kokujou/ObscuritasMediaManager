using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Client.GenericComponents;
using ObscuritasMediaManager.Client.Layout;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Dialogs;

public partial class LyricsDialog
{
    public static async Task<LyricsDialog> StartShowingAsync(string title, string lyrics, bool canAccept)
    {
        var component = new DynamicallyRenderedComponent
                        {
                            ComponentType = typeof(LyricsDialog),
                            Parameters =
                                new() { { nameof(Title), title }, { nameof(Lyrics), lyrics }, { nameof(CanSave), canAccept } }
                        };
        PageLayout.Children.Add(component);
        PageLayout.ChildrenChanged(null, null);

        while (true)
        {
            await Task.Yield();
            if (component.Instance?.Instance is not null) return (LyricsDialog) component.Instance.Instance;
        }
    }

    [Parameter]
    public required string Title { get; set; }
    [Parameter]
    public required string Lyrics { get; set; }
    [Parameter]
    public required bool CanSave { get; set; }
    public bool CanNext { get; set; } = true;
    public EventCallback OnPause { get; set; }
    public EventCallback OnPlay { get; set; }
    public EventCallback OnSave { get; set; }
    public EventCallback RequestLyrics { get; set; }
    private bool ScrollingPaused { get; set; } = true;
    private bool Animating { get; set; } = true;
    private int ExtendedScrollY { get; set; }

    private string[] LyricsLines => Lyrics.Split('\n');

    public async Task UpdateLyricsAsync(string newTitle, string newLyrics)
    {
        Title = newTitle;
        Lyrics = newLyrics;
        ExtendedScrollY = 0;

        await ResetAnimationAsync();
    }

    protected override void OnAfterRender(bool firstRender)
    {
        base.OnAfterRender(firstRender);
    }

    private async Task StartScrollingAsync(ScrollDirection direction)
    {
        while (true)
        {
            await Task.Yield();
            if (direction == ScrollDirection.Up) ExtendedScrollY += 1;
            if (direction == ScrollDirection.Down) ExtendedScrollY -= 1;
        }
    }

    private void TogglePlay()
    {
        ScrollingPaused = !ScrollingPaused;
        if (ScrollingPaused)
            Audio.Pause();
        else
            Audio.Play();
    }

    private async Task ResetAnimationAsync()
    {
        Animating = false;
        StateHasChanged();

        await JS.InvokeVoidAsync("requestAnimationFrameAsync");

        Animating = true;
        StateHasChanged();
    }

    private async Task RequestLyricsAsync()
    {
        Audio.Position = TimeSpan.Zero;
        Audio.Stop();
        ScrollingPaused = true;
        await RequestLyrics.InvokeAsync();
    }

    enum ScrollDirection
    {
        Up,
        Down
    }
}
