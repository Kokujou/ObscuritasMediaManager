﻿using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsEnum]
public enum ResponseStatus
{
    Success = 200,
    Error = 400
}