export declare class CleanupClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getBrokenAudioTracks(signal?: AbortSignal | undefined): Promise<MusicModel[]>;
    protected processGetBrokenAudioTracks(response: Response): Promise<MusicModel[]>;
    validateMediaRoot(rootPath: string, signal?: AbortSignal | undefined): Promise<boolean>;
    protected processValidateMediaRoot(response: Response): Promise<boolean>;
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
    validate(fileUrls: string[], signal?: AbortSignal | undefined): Promise<boolean>;
    protected processValidate(response: Response): Promise<boolean>;
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
    batchCreateMedia(media: MediaModel[], signal?: AbortSignal | undefined): Promise<void>;
    protected processBatchCreateMedia(response: Response): Promise<void>;
    updateMedia(id: string, _: UpdateRequestOfJsonElement, signal?: AbortSignal | undefined): Promise<void>;
    protected processUpdateMedia(response: Response): Promise<void>;
    addMediaImage(image: string, guid: string, signal?: AbortSignal | undefined): Promise<void>;
    protected processAddMediaImage(response: Response): Promise<void>;
    deleteMediaImage(guid: string, signal?: AbortSignal | undefined): Promise<void>;
    protected processDeleteMediaImage(response: Response): Promise<void>;
    importRootFolder(rootFolderPath: string, signal?: AbortSignal | undefined): Promise<MediaModel[]>;
    protected processImportRootFolder(response: Response): Promise<MediaModel[]>;
}
export declare class MusicClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getDefault(signal?: AbortSignal | undefined): Promise<MusicModel>;
    protected processGetDefault(response: Response): Promise<MusicModel>;
    createMusicTrack(track: MusicModel, signal?: AbortSignal | undefined): Promise<string>;
    protected processCreateMusicTrack(response: Response): Promise<string>;
    createMusicTrackFromPath(trackPath: string, signal?: AbortSignal | undefined): Promise<KeyValuePairOfStringAndModelCreationState>;
    protected processCreateMusicTrackFromPath(response: Response): Promise<KeyValuePairOfStringAndModelCreationState>;
    recalculateHashes(signal?: AbortSignal | undefined): Promise<void>;
    protected processRecalculateHashes(response: Response): Promise<void>;
    getAll(signal?: AbortSignal | undefined): Promise<MusicModel[]>;
    protected processGetAll(response: Response): Promise<MusicModel[]>;
    get(hash: string | null, signal?: AbortSignal | undefined): Promise<MusicModel>;
    protected processGet(response: Response): Promise<MusicModel>;
    update(hash: string | null, _: UpdateRequestOfJsonElement, signal?: AbortSignal | undefined): Promise<void>;
    protected processUpdate(response: Response): Promise<void>;
    getLyrics(hash: string | null, offset?: number | undefined, signal?: AbortSignal | undefined): Promise<LyricsResponse>;
    protected processGetLyrics(response: Response): Promise<LyricsResponse>;
    getInstruments(signal?: AbortSignal | undefined): Promise<InstrumentModel[]>;
    protected processGetInstruments(response: Response): Promise<InstrumentModel[]>;
    addInstrument(type: string | null, name: string | null, signal?: AbortSignal | undefined): Promise<void>;
    protected processAddInstrument(response: Response): Promise<void>;
    removeInstrument(type: string | null, name: string | null, signal?: AbortSignal | undefined): Promise<void>;
    protected processRemoveInstrument(response: Response): Promise<void>;
    softDeleteTracks(trackHashes: string[], signal?: AbortSignal | undefined): Promise<void>;
    protected processSoftDeleteTracks(response: Response): Promise<void>;
    undeleteTracks(trackHashes: string[], signal?: AbortSignal | undefined): Promise<void>;
    protected processUndeleteTracks(response: Response): Promise<void>;
    hardDeleteTracks(trackHashes: string[], signal?: AbortSignal | undefined): Promise<void>;
    protected processHardDeleteTracks(response: Response): Promise<void>;
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
    deletePlaylist(playlistId: string, signal?: AbortSignal | undefined): Promise<void>;
    protected processDeletePlaylist(response: Response): Promise<void>;
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
    updateRecipe(recipe: RecipeModel, signal?: AbortSignal | undefined): Promise<void>;
    protected processUpdateRecipe(response: Response): Promise<void>;
    getRecipe(id: string, signal?: AbortSignal | undefined): Promise<RecipeModel>;
    protected processGetRecipe(response: Response): Promise<RecipeModel>;
}
export declare class MusicModel implements IMusicModel {
    name: string | null;
    displayName: string | null;
    author: string | null;
    source: string | null;
    mood1: Mood;
    mood2: Mood;
    language: Language;
    instrumentation: Instrumentation;
    participants: Participants;
    instruments: InstrumentModel[] | null;
    instrumentTypes: InstrumentType[] | null;
    instrumentNames: string[] | null;
    genres: MusicGenre[] | null;
    path: string | null;
    lyrics: string | null;
    rating: number;
    complete: boolean;
    hash: string | null;
    deleted: boolean;
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
    language: Language;
    instrumentation: Instrumentation;
    participants: Participants;
    instruments: InstrumentModel[] | null;
    instrumentTypes: InstrumentType[] | null;
    instrumentNames: string[] | null;
    genres: MusicGenre[] | null;
    path: string | null;
    lyrics: string | null;
    rating: number;
    complete: boolean;
    hash: string | null;
    deleted: boolean;
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
export declare enum Language {
    Unset = "Unset",
    Japanese = "Japanese",
    English = "English",
    German = "German",
    Spain = "Spain",
    Chinese = "Chinese",
    Italian = "Italian",
    Russian = "Russian",
    SouthAmerican = "SouthAmerican",
    African = "African",
    Korean = "Korean"
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
export declare class InstrumentModel implements IInstrumentModel {
    id: number;
    name: string | null;
    type: InstrumentType;
    constructor(data?: Partial<IInstrumentModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): InstrumentModel | null;
    toJSON(data?: any): any;
    clone(): InstrumentModel;
}
export interface IInstrumentModel {
    id: number;
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
    Christmas = "Christmas",
    Enka = "Enka"
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
    contentWarnings: ContentWarning[] | null;
    description: string | null;
    genres: GenreModel[] | null;
    hash: string | null;
    id: string;
    image: string | null;
    language: Language;
    name: string | null;
    rating: number;
    release: number;
    status: MediaStatus;
    targetGroup: TargetGroup;
    type: MediaCategory;
    rootFolderPath: string | null;
    constructor(data?: Partial<IMediaModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): MediaModel | null;
    toJSON(data?: any): any;
    clone(): MediaModel;
}
export interface IMediaModel {
    contentWarnings: ContentWarning[] | null;
    description: string | null;
    genres: GenreModel[] | null;
    hash: string | null;
    id: string;
    image: string | null;
    language: Language;
    name: string | null;
    rating: number;
    release: number;
    status: MediaStatus;
    targetGroup: TargetGroup;
    type: MediaCategory;
    rootFolderPath: string | null;
}
export declare enum ContentWarning {
    Depression = "Depression",
    Drugs = "Drugs",
    Violence = "Violence",
    Horror = "Horror",
    Gore = "Gore",
    Vulgarity = "Vulgarity",
    Nudity = "Nudity"
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
    Women = "Women",
    None = "None"
}
export declare enum MediaCategory {
    AnimeSeries = "AnimeSeries",
    AnimeMovies = "AnimeMovies",
    RealMovies = "RealMovies",
    RealSeries = "RealSeries",
    JDrama = "JDrama"
}
export declare class UpdateRequestOfJsonElement implements IUpdateRequestOfJsonElement {
    oldModel: any;
    newModel: any;
    constructor(data?: Partial<IUpdateRequestOfJsonElement>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): UpdateRequestOfJsonElement | null;
    toJSON(data?: any): any;
    clone(): UpdateRequestOfJsonElement;
}
export interface IUpdateRequestOfJsonElement {
    oldModel: any;
    newModel: any;
}
export declare class KeyValuePairOfStringAndModelCreationState implements IKeyValuePairOfStringAndModelCreationState {
    key: string;
    value: ModelCreationState;
    constructor(data?: Partial<IKeyValuePairOfStringAndModelCreationState>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): KeyValuePairOfStringAndModelCreationState | null;
    toJSON(data?: any): any;
    clone(): KeyValuePairOfStringAndModelCreationState;
}
export interface IKeyValuePairOfStringAndModelCreationState {
    key: string;
    value: ModelCreationState;
}
export declare enum ModelCreationState {
    Loading = "Loading",
    Success = "Success",
    Updated = "Updated",
    Ignored = "Ignored",
    Invalid = "Invalid",
    Error = "Error"
}
export declare class LyricsResponse implements ILyricsResponse {
    title: string | null;
    text: string | null;
    constructor(data?: Partial<ILyricsResponse>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): LyricsResponse | null;
    toJSON(data?: any): any;
    clone(): LyricsResponse;
}
export interface ILyricsResponse {
    title: string | null;
    text: string | null;
}
export declare class PlaylistModel implements IPlaylistModel {
    id: string;
    name: string | null;
    author: string | null;
    image: string | null;
    rating: number;
    language: Language;
    nation: Language;
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
    language: Language;
    nation: Language;
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
    nation: Language;
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
    nation: Language;
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
