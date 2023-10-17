using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Dialogs;

public partial class DialogBase
{
    [Parameter] public string Heading { get; set; } = string.Empty;
    [Parameter] public List<DialogAction> Actions { get; set; } = new();
    [Parameter] public RenderFragment? ChildContent { get; set; }

    private void HandleKeyPress(KeyboardEventArgs args)
    {
        var matchingAction = Actions.SingleOrDefault(x => x.SupportedKeyCodes.Contains(args.Key));
        if (matchingAction is not null) matchingAction.Invoke();
    }

    public class DialogAction
    {
        public required string Text { get; set; }
        public required bool CanExecute { get; set; }
        public required Action<CancellationTokenSource> OnExecute { get; set; }
        public List<string> SupportedKeyCodes { get; set; } = new();

        public void Invoke()
        {
            if (!CanExecute) return;
            var tokenSource = new CancellationTokenSource();
            OnExecute.Invoke(tokenSource);
            if (tokenSource.Token.IsCancellationRequested) return;
        }
    }
}
