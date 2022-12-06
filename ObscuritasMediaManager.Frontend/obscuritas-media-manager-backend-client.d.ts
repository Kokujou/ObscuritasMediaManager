export declare class CleanupClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getBrokenAudioTracks(signal?: AbortSignal | undefined): Promise<MusicModel[]>;
    protected processGetBrokenAudioTracks(response: Response): Promise<MusicModel[]>;
    cleanupMusic(trackHashes: string[], signal?: AbortSignal | undefined): Promise<string[]>;
    protected processCleanupMusic(response: Response): Promise<string[]>;
}
export declare class FileClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getVideo(videoPath?: string | null | undefined, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processGetVideo(response: Response): Promise<FileResponse>;
    getAudio(audioPath?: string | null | undefined, highCompatibility?: boolean | undefined, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processGetAudio(response: Response): Promise<FileResponse>;
    validate(fileUrls: string[], signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processValidate(response: Response): Promise<FileResponse>;
}
export declare class GenreClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getAll(signal?: AbortSignal | undefined): Promise<GenreModel[]>;
    protected processGetAll(response: Response): Promise<GenreModel[]>;
}
export declare class LoginClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    login(request: CredentialsRequest, signal?: AbortSignal | undefined): Promise<string>;
    protected processLogin(response: Response): Promise<string>;
}
export declare class MediaClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    get(guid: string, signal?: AbortSignal | undefined): Promise<MediaModel>;
    protected processGet(response: Response): Promise<MediaModel>;
    getAll(type?: string | null | undefined, signal?: AbortSignal | undefined): Promise<MediaModel[]>;
    protected processGetAll(response: Response): Promise<MediaModel[]>;
    batchCreateMedia(media: MediaModel[], signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processBatchCreateMedia(response: Response): Promise<FileResponse>;
    updateMedia(media: MediaModel, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processUpdateMedia(response: Response): Promise<FileResponse>;
    addMediaImage(image: string, guid: string, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processAddMediaImage(response: Response): Promise<FileResponse>;
    deleteMediaImage(guid: string, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processDeleteMediaImage(response: Response): Promise<FileResponse>;
}
export declare class MusicClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    batchCreateMusicTracks(tracks: MusicModel[], signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processBatchCreateMusicTracks(response: Response): Promise<FileResponse>;
    getAll(signal?: AbortSignal | undefined): Promise<MusicModel[]>;
    protected processGetAll(response: Response): Promise<MusicModel[]>;
    recalculateHashes(signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processRecalculateHashes(response: Response): Promise<FileResponse>;
    get(hash: string | null, signal?: AbortSignal | undefined): Promise<MusicModel>;
    protected processGet(response: Response): Promise<MusicModel>;
    update(hash: string | null, updateRequest: UpdateRequestOfMusicModel, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processUpdate(response: Response): Promise<FileResponse>;
    getInstruments(signal?: AbortSignal | undefined): Promise<InstrumentModel[]>;
    protected processGetInstruments(response: Response): Promise<InstrumentModel[]>;
}
export declare class PlaylistClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    createTemporaryPlaylist(hashes: string[], signal?: AbortSignal | undefined): Promise<string>;
    protected processCreateTemporaryPlaylist(response: Response): Promise<string>;
    getTemporaryPlaylist(guid: string, signal?: AbortSignal | undefined): Promise<MusicModel[]>;
    protected processGetTemporaryPlaylist(response: Response): Promise<MusicModel[]>;
}
export declare class StreamingClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    batchPostStreamingEntries(streamingEntries: StreamingEntryModel[], signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processBatchPostStreamingEntries(response: Response): Promise<FileResponse>;
    getStreamingEntries(guid: string, signal?: AbortSignal | undefined): Promise<StreamingEntryModel[]>;
    protected processGetStreamingEntries(response: Response): Promise<StreamingEntryModel[]>;
    getStream(guid: string, season: string | null, episode: number, signal?: AbortSignal | undefined): Promise<StreamingEntryModel>;
    protected processGetStream(response: Response): Promise<StreamingEntryModel>;
}
export declare class MusicModel implements IMusicModel {
    name: string | null;
    author: string | null;
    source: string | null;
    mood: Mood;
    language: Nation;
    nation: Nation;
    instrumentation: Instrumentation;
    participants: Participants;
    instruments: string[] | null;
    genres: MusicGenre[] | null;
    path: string | null;
    rating: number;
    complete: boolean;
    hash: string | null;
    constructor(data?: IMusicModel);
    init(_data?: any): void;
    static fromJS(data: any): MusicModel;
    toJSON(data?: any): any;
    clone(): MusicModel;
}
export interface IMusicModel {
    name: string | null;
    author: string | null;
    source: string | null;
    mood: Mood;
    language: Nation;
    nation: Nation;
    instrumentation: Instrumentation;
    participants: Participants;
    instruments: string[] | null;
    genres: MusicGenre[] | null;
    path: string | null;
    rating: number;
    complete: boolean;
    hash: string | null;
}
export declare enum Mood {
    Unset = "Unset",
    Happy = "Happy",
    Aggressive = "Aggressive",
    Sad = "Sad",
    Cool = "Cool",
    Calm = "Calm",
    Romantic = "Romantic",
    Dramatic = "Dramatic",
    Epic = "Epic",
    Funny = "Funny",
    Passionate = "Passionate",
    Monotonuous = "Monotonuous"
}
export declare enum Nation {
    Unset = "Unset",
    Japanese = "Japanese",
    English = "English",
    German = "German",
    Spain = "Spain",
    Chinese = "Chinese",
    Italian = "Italian",
    Russian = "Russian",
    SouthAmerican = "SouthAmerican",
    African = "African"
}
export declare enum Instrumentation {
    Unset = "Unset",
    Mono = "Mono",
    Groups = "Groups",
    Mixed = "Mixed"
}
export declare enum Participants {
    Unset = "Unset",
    Solo = "Solo",
    SmallGroup = "SmallGroup",
    LargeGroup = "LargeGroup",
    SmallOrchestra = "SmallOrchestra",
    LargeOrchestra = "LargeOrchestra"
}
export declare enum MusicGenre {
    Unset = "Unset",
    Acapella = "Acapella",
    Avantgarde = "Avantgarde",
    Blues = "Blues",
    Classic = "Classic",
    Comedy = "Comedy",
    Country = "Country",
    EasyListening = "EasyListening",
    Electronic = "Electronic",
    House = "House",
    Flamenco = "Flamenco",
    Folk = "Folk",
    Jazz = "Jazz",
    Latin = "Latin",
    Pop = "Pop",
    RnB = "RnB",
    Soul = "Soul",
    Rock = "Rock",
    Metal = "Metal",
    March = "March",
    Moe = "Moe",
    Wagakki = "Wagakki",
    Medley = "Medley",
    Parody = "Parody",
    Ballad = "Ballad",
    FilmMusic = "FilmMusic",
    Western = "Western",
    Christmas = "Christmas"
}
export declare class GenreModel implements IGenreModel {
    id: string;
    section: string | null;
    name: string | null;
    constructor(data?: IGenreModel);
    init(_data?: any): void;
    static fromJS(data: any): GenreModel;
    toJSON(data?: any): any;
    clone(): GenreModel;
}
export interface IGenreModel {
    id: string;
    section: string | null;
    name: string | null;
}
export declare class CredentialsRequest implements ICredentialsRequest {
    username: string | null;
    password: string | null;
    constructor(data?: ICredentialsRequest);
    init(_data?: any): void;
    static fromJS(data: any): CredentialsRequest;
    toJSON(data?: any): any;
    clone(): CredentialsRequest;
}
export interface ICredentialsRequest {
    username: string | null;
    password: string | null;
}
export declare class MediaModel implements IMediaModel {
    id: string;
    name: string | null;
    type: string | null;
    rating: number;
    release: number;
    genres: string[] | null;
    state: number;
    description: string | null;
    image: string | null;
    constructor(data?: IMediaModel);
    init(_data?: any): void;
    static fromJS(data: any): MediaModel;
    toJSON(data?: any): any;
    clone(): MediaModel;
}
export interface IMediaModel {
    id: string;
    name: string | null;
    type: string | null;
    rating: number;
    release: number;
    genres: string[] | null;
    state: number;
    description: string | null;
    image: string | null;
}
export declare class InstrumentModel implements IInstrumentModel {
    name: string | null;
    type: InstrumentType;
    constructor(data?: IInstrumentModel);
    init(_data?: any): void;
    static fromJS(data: any): InstrumentModel;
    toJSON(data?: any): any;
    clone(): InstrumentModel;
}
export interface IInstrumentModel {
    name: string | null;
    type: InstrumentType;
}
export declare enum InstrumentType {
    Unset = "Unset",
    Vocal = "Vocal",
    WoodWind = "WoodWind",
    Brass = "Brass",
    Percussion = "Percussion",
    Stringed = "Stringed",
    Keyboard = "Keyboard",
    Electronic = "Electronic",
    HumanBody = "HumanBody",
    Miscellaneous = "Miscellaneous"
}
export declare class UpdateRequestOfMusicModel implements IUpdateRequestOfMusicModel {
    oldModel: MusicModel | null;
    newModel: MusicModel | null;
    constructor(data?: IUpdateRequestOfMusicModel);
    init(_data?: any): void;
    static fromJS(data: any): UpdateRequestOfMusicModel;
    toJSON(data?: any): any;
    clone(): UpdateRequestOfMusicModel;
}
export interface IUpdateRequestOfMusicModel {
    oldModel: MusicModel | null;
    newModel: MusicModel | null;
}
export declare class StreamingEntryModel implements IStreamingEntryModel {
    id: string;
    season: string | null;
    episode: number;
    src: string | null;
    constructor(data?: IStreamingEntryModel);
    init(_data?: any): void;
    static fromJS(data: any): StreamingEntryModel;
    toJSON(data?: any): any;
    clone(): StreamingEntryModel;
}
export interface IStreamingEntryModel {
    id: string;
    season: string | null;
    episode: number;
    src: string | null;
}
export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: {
        [name: string]: any;
    };
}
export declare class SwaggerException extends Error {
    message: string;
    status: number;
    response: string;
    headers: {
        [key: string]: any;
    };
    result: any;
    constructor(message: string, status: number, response: string, headers: {
        [key: string]: any;
    }, result: any);
    protected isSwaggerException: boolean;
    static isSwaggerException(obj: any): obj is SwaggerException;
}
