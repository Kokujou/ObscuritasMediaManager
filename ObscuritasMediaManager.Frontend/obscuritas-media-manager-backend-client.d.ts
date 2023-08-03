export declare class CleanupClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    cleanupMusic(trackHashes: string[], signal?: AbortSignal | undefined): Promise<string[]>;
    protected processCleanupMusic(response: Response): Promise<string[]>;
    getBrokenAudioTracks(signal?: AbortSignal | undefined): Promise<MusicModel[]>;
    protected processGetBrokenAudioTracks(response: Response): Promise<MusicModel[]>;
}
export declare class FileClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getAudio(audioPath?: string | null | undefined, highCompatibility?: boolean | undefined, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processGetAudio(response: Response): Promise<FileResponse>;
    getVideo(videoPath?: string | null | undefined, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processGetVideo(response: Response): Promise<FileResponse>;
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
    addMediaImage(image: string, guid: string, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processAddMediaImage(response: Response): Promise<FileResponse>;
    deleteMediaImage(guid: string, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processDeleteMediaImage(response: Response): Promise<FileResponse>;
    batchCreateMedia(media: MediaModel[], signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processBatchCreateMedia(response: Response): Promise<FileResponse>;
    getAll(type?: string | null | undefined, signal?: AbortSignal | undefined): Promise<MediaModel[]>;
    protected processGetAll(response: Response): Promise<MediaModel[]>;
    updateMedia(media: MediaModel, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processUpdateMedia(response: Response): Promise<FileResponse>;
    get(guid: string, signal?: AbortSignal | undefined): Promise<MediaModel>;
    protected processGet(response: Response): Promise<MediaModel>;
}
export declare class MusicClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    addInstrument(type: InstrumentType, name: string | null, signal?: AbortSignal | undefined): Promise<void>;
    protected processAddInstrument(response: Response): Promise<void>;
    removeInstrument(type: InstrumentType, name: string | null, signal?: AbortSignal | undefined): Promise<void>;
    protected processRemoveInstrument(response: Response): Promise<void>;
    batchCreateMusicTracks(tracks: MusicModel[], signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processBatchCreateMusicTracks(response: Response): Promise<FileResponse>;
    getAll(signal?: AbortSignal | undefined): Promise<MusicModel[]>;
    protected processGetAll(response: Response): Promise<MusicModel[]>;
    get(hash: string | null, signal?: AbortSignal | undefined): Promise<MusicModel>;
    protected processGet(response: Response): Promise<MusicModel>;
    update(hash: string | null, updateRequest: UpdateRequestOfMusicModel, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processUpdate(response: Response): Promise<FileResponse>;
    getInstruments(signal?: AbortSignal | undefined): Promise<InstrumentModel[]>;
    protected processGetInstruments(response: Response): Promise<InstrumentModel[]>;
    recalculateHashes(signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processRecalculateHashes(response: Response): Promise<FileResponse>;
}
export declare class PlaylistClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    createTemporaryPlaylist(hashes: string[], signal?: AbortSignal | undefined): Promise<number>;
    protected processCreateTemporaryPlaylist(response: Response): Promise<number>;
    getPlaylist(playlistId: number, signal?: AbortSignal | undefined): Promise<PlaylistModel>;
    protected processGetPlaylist(response: Response): Promise<PlaylistModel>;
    updatePlaylistData(playlistId: number, updateRequest: UpdateRequestOfPlaylistModel, signal?: AbortSignal | undefined): Promise<void>;
    protected processUpdatePlaylistData(response: Response): Promise<void>;
    listPlaylists(signal?: AbortSignal | undefined): Promise<PlaylistModel[]>;
    protected processListPlaylists(response: Response): Promise<PlaylistModel[]>;
}
export declare class RecipeClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    createRecipe(recipe: RecipeModel, signal?: AbortSignal | undefined): Promise<void>;
    protected processCreateRecipe(response: Response): Promise<void>;
    getAllRecipes(signal?: AbortSignal | undefined): Promise<RecipeModel[]>;
    protected processGetAllRecipes(response: Response): Promise<RecipeModel[]>;
    updateRecipe(recipe: RecipeModel, signal?: AbortSignal | undefined): Promise<FileResponse>;
    protected processUpdateRecipe(response: Response): Promise<FileResponse>;
    getRecipe(id: string, signal?: AbortSignal | undefined): Promise<RecipeModel>;
    protected processGetRecipe(response: Response): Promise<RecipeModel>;
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
    getStream(guid: string, season: string | null, episode: number, signal?: AbortSignal | undefined): Promise<StreamingEntryModel>;
    protected processGetStream(response: Response): Promise<StreamingEntryModel>;
    getStreamingEntries(guid: string, signal?: AbortSignal | undefined): Promise<StreamingEntryModel[]>;
    protected processGetStreamingEntries(response: Response): Promise<StreamingEntryModel[]>;
}
export declare class MusicModel implements IMusicModel {
    author: string | null;
    complete: boolean;
    displayName: string | null;
    genres: MusicGenre[] | null;
    hash: string | null;
    instrumentation: Instrumentation;
    instruments: string[] | null;
    language: Nation;
    mood1: Mood;
    mood2: Mood;
    name: string | null;
    nation: Nation;
    participants: Participants;
    path: string | null;
    rating: number;
    source: string | null;
    constructor(data?: Partial<IMusicModel>);
    init(_data?: any): void;
    static fromJS(data: any): MusicModel;
    toJSON(data?: any): any;
    clone(): MusicModel;
}
export interface IMusicModel {
    author: string | null;
    complete: boolean;
    displayName: string | null;
    genres: MusicGenre[] | null;
    hash: string | null;
    instrumentation: Instrumentation;
    instruments: string[] | null;
    language: Nation;
    mood1: Mood;
    mood2: Mood;
    name: string | null;
    nation: Nation;
    participants: Participants;
    path: string | null;
    rating: number;
    source: string | null;
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
export declare enum Instrumentation {
    Unset = "Unset",
    Mono = "Mono",
    Groups = "Groups",
    Mixed = "Mixed"
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
export declare enum Participants {
    Unset = "Unset",
    Solo = "Solo",
    SmallGroup = "SmallGroup",
    LargeGroup = "LargeGroup",
    SmallOrchestra = "SmallOrchestra",
    LargeOrchestra = "LargeOrchestra"
}
export declare class GenreModel implements IGenreModel {
    id: string;
    name: string | null;
    section: string | null;
    constructor(data?: Partial<IGenreModel>);
    init(_data?: any): void;
    static fromJS(data: any): GenreModel;
    toJSON(data?: any): any;
    clone(): GenreModel;
}
export interface IGenreModel {
    id: string;
    name: string | null;
    section: string | null;
}
export declare class CredentialsRequest implements ICredentialsRequest {
    username: string | null;
    password: string | null;
    constructor(data?: Partial<ICredentialsRequest>);
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
    description: string | null;
    genres: string[] | null;
    id: string;
    image: string | null;
    name: string | null;
    rating: number;
    release: number;
    state: number;
    type: string | null;
    constructor(data?: Partial<IMediaModel>);
    init(_data?: any): void;
    static fromJS(data: any): MediaModel;
    toJSON(data?: any): any;
    clone(): MediaModel;
}
export interface IMediaModel {
    description: string | null;
    genres: string[] | null;
    id: string;
    image: string | null;
    name: string | null;
    rating: number;
    release: number;
    state: number;
    type: string | null;
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
export declare class InstrumentModel implements IInstrumentModel {
    name: string | null;
    type: InstrumentType;
    constructor(data?: Partial<IInstrumentModel>);
    init(_data?: any): void;
    static fromJS(data: any): InstrumentModel;
    toJSON(data?: any): any;
    clone(): InstrumentModel;
}
export interface IInstrumentModel {
    name: string | null;
    type: InstrumentType;
}
export declare class UpdateRequestOfMusicModel implements IUpdateRequestOfMusicModel {
    newModel: MusicModel | null;
    oldModel: MusicModel | null;
    constructor(data?: Partial<IUpdateRequestOfMusicModel>);
    init(_data?: any): void;
    static fromJS(data: any): UpdateRequestOfMusicModel;
    toJSON(data?: any): any;
    clone(): UpdateRequestOfMusicModel;
}
export interface IUpdateRequestOfMusicModel {
    newModel: MusicModel | null;
    oldModel: MusicModel | null;
}
export declare class PlaylistModel implements IPlaylistModel {
    author: string | null;
    complete: boolean;
    genres: MusicGenre[] | null;
    id: number;
    image: string | null;
    isTemporary: boolean;
    language: Nation;
    name: string | null;
    nation: Nation;
    rating: number;
    tracks: MusicModel[] | null;
    constructor(data?: Partial<IPlaylistModel>);
    init(_data?: any): void;
    static fromJS(data: any): PlaylistModel;
    toJSON(data?: any): any;
    clone(): PlaylistModel;
}
export interface IPlaylistModel {
    author: string | null;
    complete: boolean;
    genres: MusicGenre[] | null;
    id: number;
    image: string | null;
    isTemporary: boolean;
    language: Nation;
    name: string | null;
    nation: Nation;
    rating: number;
    tracks: MusicModel[] | null;
}
export declare class UpdateRequestOfPlaylistModel implements IUpdateRequestOfPlaylistModel {
    newModel: PlaylistModel | null;
    oldModel: PlaylistModel | null;
    constructor(data?: Partial<IUpdateRequestOfPlaylistModel>);
    init(_data?: any): void;
    static fromJS(data: any): UpdateRequestOfPlaylistModel;
    toJSON(data?: any): any;
    clone(): UpdateRequestOfPlaylistModel;
}
export interface IUpdateRequestOfPlaylistModel {
    newModel: PlaylistModel | null;
    oldModel: PlaylistModel | null;
}
export declare class RecipeModel implements IRecipeModel {
    cookingTime: string;
    course: Course;
    difficulty: number;
    formattedText: string | null;
    id: string;
    imageUrl: string | null;
    ingredients: IngredientModel[] | null;
    mainIngredient: Ingredient;
    nation: Nation;
    preparationTime: string;
    rating: number;
    technique: CookingTechnique;
    title: string | null;
    totalTime: string;
    constructor(data?: Partial<IRecipeModel>);
    init(_data?: any): void;
    static fromJS(data: any): RecipeModel;
    toJSON(data?: any): any;
    clone(): RecipeModel;
}
export interface IRecipeModel {
    cookingTime: string;
    course: Course;
    difficulty: number;
    formattedText: string | null;
    id: string;
    imageUrl: string | null;
    ingredients: IngredientModel[] | null;
    mainIngredient: Ingredient;
    nation: Nation;
    preparationTime: string;
    rating: number;
    technique: CookingTechnique;
    title: string | null;
    totalTime: string;
}
export declare enum Course {
    Starter = "Starter",
    Main = "Main",
    Side = "Side",
    Desert = "Desert",
    Salad = "Salad",
    Soup = "Soup",
    Drink = "Drink",
    Snack = "Snack"
}
export declare class IngredientModel implements IIngredientModel {
    amount: number;
    description: string | null;
    groupName: string | null;
    id: string;
    measurement: Measurement;
    name: string | null;
    order: number;
    recipeId: string;
    constructor(data?: Partial<IIngredientModel>);
    init(_data?: any): void;
    static fromJS(data: any): IngredientModel;
    toJSON(data?: any): any;
    clone(): IngredientModel;
}
export interface IIngredientModel {
    amount: number;
    description: string | null;
    groupName: string | null;
    id: string;
    measurement: Measurement;
    name: string | null;
    order: number;
    recipeId: string;
}
export declare enum Measurement {
    Mass = "Mass",
    Volume = "Volume",
    Size = "Size",
    Pinch = "Pinch",
    Piece = "Piece",
    Unitless = "Unitless"
}
export declare enum Ingredient {
    Meat = "Meat",
    Noodles = "Noodles",
    Rice = "Rice",
    Bread = "Bread",
    Fish = "Fish",
    Vegetables = "Vegetables",
    Fruits = "Fruits",
    Sweets = "Sweets",
    Miscellaneous = "Miscellaneous"
}
export declare enum CookingTechnique {
    Boiling = "Boiling",
    Baking = "Baking",
    Frying = "Frying",
    DeepFrying = "DeepFrying",
    Steaming = "Steaming",
    Mixed = "Mixed",
    Freezing = "Freezing",
    Grilling = "Grilling",
    Raw = "Raw"
}
export declare class StreamingEntryModel implements IStreamingEntryModel {
    episode: number;
    id: string;
    season: string | null;
    src: string | null;
    constructor(data?: Partial<IStreamingEntryModel>);
    init(_data?: any): void;
    static fromJS(data: any): StreamingEntryModel;
    toJSON(data?: any): any;
    clone(): StreamingEntryModel;
}
export interface IStreamingEntryModel {
    episode: number;
    id: string;
    season: string | null;
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
