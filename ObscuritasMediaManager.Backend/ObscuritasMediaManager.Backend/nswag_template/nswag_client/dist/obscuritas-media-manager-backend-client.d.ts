import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
export declare const OBSCURITAS_MEDIA_MANAGER_BACKEND_API_BASE_URL: InjectionToken<string>;
export declare class FileClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(http: HttpClient, baseUrl?: string);
    getVideo(videoPath?: string | null | undefined): Observable<FileResponse>;
    protected processGetVideo(response: HttpResponseBase): Observable<FileResponse>;
    getAudio(audioPath?: string | null | undefined): Observable<FileResponse>;
    protected processGetAudio(response: HttpResponseBase): Observable<FileResponse>;
    validate(fileUrls: string[]): Observable<FileResponse>;
    protected processValidate(response: HttpResponseBase): Observable<FileResponse>;
}
export declare class GenreClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(http: HttpClient, baseUrl?: string);
    getAll(): Observable<FileResponse>;
    protected processGetAll(response: HttpResponseBase): Observable<FileResponse>;
}
export declare class MediaClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(http: HttpClient, baseUrl?: string);
    get(guid: string): Observable<FileResponse>;
    protected processGet(response: HttpResponseBase): Observable<FileResponse>;
    getAll(type?: string | null | undefined): Observable<FileResponse>;
    protected processGetAll(response: HttpResponseBase): Observable<FileResponse>;
    batchPostStreamingEntries(media: MediaModel[]): Observable<FileResponse>;
    protected processBatchPostStreamingEntries(response: HttpResponseBase): Observable<FileResponse>;
    updateMedia(media: MediaModel): Observable<FileResponse>;
    protected processUpdateMedia(response: HttpResponseBase): Observable<FileResponse>;
    addMediaImage(request: UpdateImageRequest, guid: string): Observable<FileResponse>;
    protected processAddMediaImage(response: HttpResponseBase): Observable<FileResponse>;
    deleteMediaImage(guid: string): Observable<FileResponse>;
    protected processDeleteMediaImage(response: HttpResponseBase): Observable<FileResponse>;
}
export declare class MusicClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(http: HttpClient, baseUrl?: string);
    batchCreateMusicTracks(tracks: MusicModel[]): Observable<FileResponse>;
    protected processBatchCreateMusicTracks(response: HttpResponseBase): Observable<FileResponse>;
    getAll(): Observable<MusicModel[]>;
    protected processGetAll(response: HttpResponseBase): Observable<MusicModel[]>;
    get(guid: string): Observable<MusicModel>;
    protected processGet(response: HttpResponseBase): Observable<MusicModel>;
    getInstruments(): Observable<InstrumentModel[]>;
    protected processGetInstruments(response: HttpResponseBase): Observable<InstrumentModel[]>;
    update(id: string, updateRequest: UpdateRequestOfMusicModel): Observable<FileResponse>;
    protected processUpdate(response: HttpResponseBase): Observable<FileResponse>;
}
export declare class PlaylistClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(http: HttpClient, baseUrl?: string);
    createTemporaryPlaylist(entries: string[]): Observable<FileResponse>;
    protected processCreateTemporaryPlaylist(response: HttpResponseBase): Observable<FileResponse>;
    getTemporaryPlaylist(guid: string): Observable<FileResponse>;
    protected processGetTemporaryPlaylist(response: HttpResponseBase): Observable<FileResponse>;
}
export declare class StreamingClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(http: HttpClient, baseUrl?: string);
    batchPostStreamingEntries(streamingEntries: StreamingEntryModel[]): Observable<FileResponse>;
    protected processBatchPostStreamingEntries(response: HttpResponseBase): Observable<FileResponse>;
    getStreamingEntry(guid: string): Observable<FileResponse>;
    protected processGetStreamingEntry(response: HttpResponseBase): Observable<FileResponse>;
    getStream(guid: string, season: string | null, episode: number): Observable<FileResponse>;
    protected processGetStream(response: HttpResponseBase): Observable<FileResponse>;
}
export declare class MediaModel implements IMediaModel {
    id?: string;
    name?: string | undefined;
    type?: string | undefined;
    rating?: number;
    release?: number;
    genreString?: string | undefined;
    genres?: string[] | undefined;
    state?: number;
    description?: string | undefined;
    image?: string | undefined;
    constructor(data?: IMediaModel);
    init(_data?: any): void;
    static fromJS(data: any): MediaModel;
    toJSON(data?: any): any;
}
export interface IMediaModel {
    id?: string;
    name?: string | undefined;
    type?: string | undefined;
    rating?: number;
    release?: number;
    genreString?: string | undefined;
    genres?: string[] | undefined;
    state?: number;
    description?: string | undefined;
    image?: string | undefined;
}
export declare class UpdateImageRequest implements IUpdateImageRequest {
    image?: string | undefined;
    constructor(data?: IUpdateImageRequest);
    init(_data?: any): void;
    static fromJS(data: any): UpdateImageRequest;
    toJSON(data?: any): any;
}
export interface IUpdateImageRequest {
    image?: string | undefined;
}
export declare class MusicModel implements IMusicModel {
    id?: string;
    name?: string | undefined;
    author?: string | undefined;
    source?: string | undefined;
    mood?: Mood;
    language?: Nation;
    nation?: Nation;
    instrumentation?: Instrumentation;
    participants?: Participants;
    instrumentsString?: string | undefined;
    genreString?: string | undefined;
    genres?: Genre[] | undefined;
    src?: string | undefined;
    rating?: number;
    complete?: boolean | undefined;
    constructor(data?: IMusicModel);
    init(_data?: any): void;
    static fromJS(data: any): MusicModel;
    toJSON(data?: any): any;
}
export interface IMusicModel {
    id?: string;
    name?: string | undefined;
    author?: string | undefined;
    source?: string | undefined;
    mood?: Mood;
    language?: Nation;
    nation?: Nation;
    instrumentation?: Instrumentation;
    participants?: Participants;
    instrumentsString?: string | undefined;
    genreString?: string | undefined;
    genres?: Genre[] | undefined;
    src?: string | undefined;
    rating?: number;
    complete?: boolean | undefined;
}
export declare enum Mood {
    Unset = "Unset",
    Happy = "Happy",
    Aggressive = "Aggressive",
    Sad = "Sad",
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
export declare enum Genre {
    Unset = "Unset",
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
    FilmMusic = "FilmMusic"
}
export declare class InstrumentModel implements IInstrumentModel {
    name?: string | undefined;
    type?: InstrumentType;
    constructor(data?: IInstrumentModel);
    init(_data?: any): void;
    static fromJS(data: any): InstrumentModel;
    toJSON(data?: any): any;
}
export interface IInstrumentModel {
    name?: string | undefined;
    type?: InstrumentType;
}
export declare enum InstrumentType {
    Unset = "Unset",
    Vocal = "Vocal",
    WoodWind = "WoodWind",
    Brass = "Brass",
    Percussion = "Percussion",
    Stringed = "Stringed",
    Keyboard = "Keyboard",
    Electronic = "Electronic"
}
export declare class UpdateRequestOfMusicModel implements IUpdateRequestOfMusicModel {
    oldModel?: MusicModel | undefined;
    newModel?: MusicModel | undefined;
    constructor(data?: IUpdateRequestOfMusicModel);
    init(_data?: any): void;
    static fromJS(data: any): UpdateRequestOfMusicModel;
    toJSON(data?: any): any;
}
export interface IUpdateRequestOfMusicModel {
    oldModel?: MusicModel | undefined;
    newModel?: MusicModel | undefined;
}
export declare class StreamingEntryModel implements IStreamingEntryModel {
    id?: string;
    season?: string | undefined;
    episode?: number;
    src?: string | undefined;
    constructor(data?: IStreamingEntryModel);
    init(_data?: any): void;
    static fromJS(data: any): StreamingEntryModel;
    toJSON(data?: any): any;
}
export interface IStreamingEntryModel {
    id?: string;
    season?: string | undefined;
    episode?: number;
    src?: string | undefined;
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
