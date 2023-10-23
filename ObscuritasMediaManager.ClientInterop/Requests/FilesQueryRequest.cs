using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Requests;

[ExportTsClass]
public class FilesQueryRequest
{
    public required bool Multiselect { get; set; }
    public required Dictionary<string, List<string>> NameExtensionMap { get; set; }

    public string GetDialogFilter()
    {
        return string.Join(
            "|", NameExtensionMap.Select(filter => $"{filter.Key}|{filter.Value.Select(ext => string.Join(";", ext))}"));
    }
}
