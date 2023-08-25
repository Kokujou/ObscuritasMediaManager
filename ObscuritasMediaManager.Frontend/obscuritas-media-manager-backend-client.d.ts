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
    addGenre(section: string | null, name: string | null, signal?: AbortSignal | undefined): Promise<void>;
    protected processAddGenre(response: Response): Promise<void>;
    removeGenre(id: string, signal?: AbortSignal | undefined): Promise<void>;
    protected processRemoveGenre(response: Response): Promise<void>;
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
    getAll(signal?: AbortSignal | undefined): Promise<MediaModel[]>;
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
    addInstrument(type: InstrumentType, name: string | null, signal?: AbortSignal | undefined): Promise<void>;
    protected processAddInstrument(response: Response): Promise<void>;
    removeInstrument(type: InstrumentType, name: string | null, signal?: AbortSignal | undefined): Promise<void>;
    protected processRemoveInstrument(response: Response): Promise<void>;
}
export declare class PlaylistClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getDummyPlaylist(signal?: AbortSignal | undefined): Promise<PlaylistModel>;
    protected processGetDummyPlaylist(response: Response): Promise<PlaylistModel>;
    createTemporaryPlaylist(hashes: string[], signal?: AbortSignal | undefined): Promise<string>;
    protected processCreateTemporaryPlaylist(response: Response): Promise<string>;
    getPlaylist(playlistId: string, signal?: AbortSignal | undefined): Promise<PlaylistModel>;
    protected processGetPlaylist(response: Response): Promise<PlaylistModel>;
    updatePlaylistData(playlistId: string, updateRequest: UpdateRequestOfPlaylistModel, signal?: AbortSignal | undefined): Promise<void>;
    protected processUpdatePlaylistData(response: Response): Promise<void>;
    listPlaylists(signal?: AbortSignal | undefined): Promise<PlaylistModel[]>;
    protected processListPlaylists(response: Response): Promise<PlaylistModel[]>;
    createPlaylist(playlist: PlaylistModel, signal?: AbortSignal | undefined): Promise<void>;
    protected processCreatePlaylist(response: Response): Promise<void>;
    addTracksToPlaylist(playlistId: string, trackHashes: string[], signal?: AbortSignal | undefined): Promise<void>;
    protected processAddTracksToPlaylist(response: Response): Promise<void>;
}
export declare class RecipeClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getAllRecipes(signal?: AbortSignal | undefined): Promise<RecipeModel[]>;
    protected processGetAllRecipes(response: Response): Promise<RecipeModel[]>;
    createRecipe(recipe: RecipeModel, signal?: AbortSignal | undefined): Promise<void>;
    protected processCreateRecipe(response: Response): Promise<void>;
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
    getStreamingEntries(guid: string, signal?: AbortSignal | undefined): Promise<StreamingEntryModel[]>;
    protected processGetStreamingEntries(response: Response): Promise<StreamingEntryModel[]>;
    getStream(guid: string, season: string | null, episode: number, signal?: AbortSignal | undefined): Promise<StreamingEntryModel>;
    protected processGetStream(response: Response): Promise<StreamingEntryModel>;
}
export declare class MusicModel implements IMusicModel {
    name: string | null;
    displayName: string | null;
    author: string | null;
    source: string | null;
    mood1: Mood;
    mood2: Mood;
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
    fileBytes: number;
    constructor(data?: Partial<IMusicModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): MusicModel | null;
    toJSON(data?: any): any;
    clone(): MusicModel;
}
export interface IMusicModel {
    name: string | null;
    displayName: string | null;
    author: string | null;
    source: string | null;
    mood1: Mood;
    mood2: Mood;
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
    fileBytes: number;
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
    constructor(data?: Partial<IGenreModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): GenreModel | null;
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
    constructor(data?: Partial<ICredentialsRequest>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): CredentialsRequest | null;
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
    type: MediaCategory | null;
    rating: number | null;
    release: number | null;
    language: Nation | null;
    status: MediaStatus | null;
    genres: string[] | null;
    targetGroup: TargetGroup | null;
    contentWarnings: ContentWarning[] | null;
    description: string | null;
    image: string | null;
    hash: string | null;
    constructor(data?: Partial<IMediaModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): MediaModel | null;
    toJSON(data?: any): any;
    clone(): MediaModel;
}
export interface IMediaModel {
    id: string;
    name: string | null;
    type: MediaCategory | null;
    rating: number | null;
    release: number | null;
    language: Nation | null;
    status: MediaStatus | null;
    genres: string[] | null;
    targetGroup: TargetGroup | null;
    contentWarnings: ContentWarning[] | null;
    description: string | null;
    image: string | null;
    hash: string | null;
}
export declare enum MediaCategory {
    AnimeSeries = "AnimeSeries",
    AnimeMovies = "AnimeMovies",
    RealMovies = "RealMovies",
    RealSeries = "RealSeries",
    JDrama = "JDrama"
}
export declare enum MediaStatus {
    Completed = "Completed",
    Airing = "Airing",
    PreAiring = "PreAiring",
    Aborted = "Aborted"
}
export declare enum TargetGroup {
    Children = "Children",
    Adolescents = "Adolescents",
    Adults = "Adults",
    Families = "Families",
    Men = "Men",
    Women = "Women"
}
export declare enum ContentWarning {
    Violence = "Violence",
    Nudity = "Nudity",
    Gore = "Gore",
    Horror = "Horror",
    Vulgarity = "Vulgarity",
    Drugs = "Drugs",
    Depression = "Depression"
}
export declare class InstrumentModel implements IInstrumentModel {
    name: string | null;
    type: InstrumentType;
    constructor(data?: Partial<IInstrumentModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): InstrumentModel | null;
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
    constructor(data?: Partial<IUpdateRequestOfMusicModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): UpdateRequestOfMusicModel | null;
    toJSON(data?: any): any;
    clone(): UpdateRequestOfMusicModel;
}
export interface IUpdateRequestOfMusicModel {
    oldModel: MusicModel | null;
    newModel: MusicModel | null;
}
export declare class PlaylistModel implements IPlaylistModel {
    id: string;
    name: string | null;
    author: string | null;
    image: string | null;
    rating: number;
    language: Nation;
    nation: Nation;
    genres: MusicGenre[] | null;
    complete: boolean;
    isTemporary: boolean;
    tracks: MusicModel[] | null;
    constructor(data?: Partial<IPlaylistModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): PlaylistModel | null;
    toJSON(data?: any): any;
    clone(): PlaylistModel;
}
export interface IPlaylistModel {
    id: string;
    name: string | null;
    author: string | null;
    image: string | null;
    rating: number;
    language: Nation;
    nation: Nation;
    genres: MusicGenre[] | null;
    complete: boolean;
    isTemporary: boolean;
    tracks: MusicModel[] | null;
}
export declare class UpdateRequestOfPlaylistModel implements IUpdateRequestOfPlaylistModel {
    oldModel: PlaylistModel | null;
    newModel: PlaylistModel | null;
    constructor(data?: Partial<IUpdateRequestOfPlaylistModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): UpdateRequestOfPlaylistModel | null;
    toJSON(data?: any): any;
    clone(): UpdateRequestOfPlaylistModel;
}
export interface IUpdateRequestOfPlaylistModel {
    oldModel: PlaylistModel | null;
    newModel: PlaylistModel | null;
}
export declare class RecipeModel implements IRecipeModel {
    id: string;
    title: string | null;
    nation: Nation;
    imageUrl: string | null;
    difficulty: number;
    rating: number;
    course: Course;
    mainIngredient: Ingredient;
    technique: CookingTechnique;
    preparationTime: string;
    cookingTime: string;
    totalTime: string;
    ingredients: IngredientModel[] | null;
    formattedText: string | null;
    constructor(data?: Partial<IRecipeModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): RecipeModel | null;
    toJSON(data?: any): any;
    clone(): RecipeModel;
}
export interface IRecipeModel {
    id: string;
    title: string | null;
    nation: Nation;
    imageUrl: string | null;
    difficulty: number;
    rating: number;
    course: Course;
    mainIngredient: Ingredient;
    technique: CookingTechnique;
    preparationTime: string;
    cookingTime: string;
    totalTime: string;
    ingredients: IngredientModel[] | null;
    formattedText: string | null;
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
export declare class IngredientModel implements IIngredientModel {
    id: string;
    recipeId: string;
    name: string | null;
    description: string | null;
    groupName: string | null;
    amount: number;
    measurement: Measurement;
    order: number;
    constructor(data?: Partial<IIngredientModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): IngredientModel | null;
    toJSON(data?: any): any;
    clone(): IngredientModel;
}
export interface IIngredientModel {
    id: string;
    recipeId: string;
    name: string | null;
    description: string | null;
    groupName: string | null;
    amount: number;
    measurement: Measurement;
    order: number;
}
export declare enum Measurement {
    Mass = "Mass",
    Volume = "Volume",
    Size = "Size",
    Pinch = "Pinch",
    Piece = "Piece",
    Unitless = "Unitless"
}
export declare class StreamingEntryModel implements IStreamingEntryModel {
    id: string;
    season: string | null;
    episode: number;
    src: string | null;
    constructor(data?: Partial<IStreamingEntryModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): StreamingEntryModel | null;
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
