using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Queries;

[ExportTsEnum]
public enum InteropQuery
{
    RequestFiles,
    RequestFolderContent,
    RequestSubFolders,
    LoadTrack,
    RequestFolderPath
}