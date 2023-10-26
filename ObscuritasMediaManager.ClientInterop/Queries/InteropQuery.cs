using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Queries;

[ExportTsEnum]
public enum InteropQuery
{
    RequestFiles,
    RequestFolderContent,
    RequestFolderPath,
    LoadTrack,
}
