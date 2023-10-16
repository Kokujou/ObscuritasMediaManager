using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public static class FileDialogConstants
{
    public const string AudioFilter = "Audio-Dateien|*.3gp;*.aa;*.aac;*.aax;*.act;*.aiff;*.alac;*.amr;*.ape;*.au;*.awb;*.dss;*.dvf;*.flac;*.gsm;*.iklax;*.ivs;*.m4a;*.m4b;*.m4p;*.mmf;*.movpkg;*.mp3;*.mpc;*.msv;*.nmf;*.ogg,;*.opus;*.ra,;*.raw;*.rf64;*.sln;*.tta;*.voc;*.vox;*.wav;*.wma;*.wv;*.webm;*.8svx;*.cda";
    public const string ImageFilter = "Image Files (*.bmp;*.jpg;*.jpeg;*.png, *.webp)|*.bmp;*.jpg;*.jpeg;*.png;*.webp";

    public static readonly string[] AudioExtensions = new[]
    {
        ".3gp",
        ".aa",
        ".aac",
        ".aax",
        ".act",
        ".aiff",
        ".alac",
        ".amr",
        ".ape",
        ".au",
        ".awb",
        ".dss",
        ".dvf",
        ".flac",
        ".gsm",
        ".iklax",
        ".ivs",
        ".m4a",
        ".m4b",
        ".m4p",
        ".mmf",
        ".movpkg",
        ".mp3",
        ".mpc",
        ".msv",
        ".nmf",
        ".ogg,",
        ".opus",
        ".ra,",
        ".raw",
        ".rf64",
        ".sln",
        ".tta",
        ".voc",
        ".vox",
        ".wav",
        ".wma",
        ".wv",
        ".webm",
        ".8svx",
        ".cda"
    };
}
