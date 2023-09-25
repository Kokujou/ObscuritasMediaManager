using System.Windows;

namespace ObscuritasMediaManager.Client;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : Window
{
    public static MainWindow? Instance { get; private set; }

    public MainWindow()
    {
        Instance = this;
        Resources.Add("services", Startup.Services);
        InitializeComponent();
    }
}
