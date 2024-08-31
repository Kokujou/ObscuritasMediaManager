export declare class CleanupClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getBrokenAudioTracks(signal?: AbortSignal): Promise<MusicModel[]>;
    protected processGetBrokenAudioTracks(response: Response): Promise<MusicModel[]>;
    validateMediaRoot(rootPath: string, signal?: AbortSignal): Promise<boolean>;
    protected processValidateMediaRoot(response: Response): Promise<boolean>;
}
export declare class FileClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getVideo(videoPath?: string | undefined, signal?: AbortSignal): Promise<FileResponse | null>;
    protected processGetVideo(response: Response): Promise<FileResponse | null>;
    getAudio(audioPath?: string | undefined, highCompatibility?: boolean | undefined, signal?: AbortSignal): Promise<FileResponse | null>;
    protected processGetAudio(response: Response): Promise<FileResponse | null>;
    validate(fileUrls: string[], signal?: AbortSignal): Promise<boolean>;
    protected processValidate(response: Response): Promise<boolean>;
}
export declare class GenreClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getAll(signal?: AbortSignal): Promise<MediaGenreModel[]>;
    protected processGetAll(response: Response): Promise<MediaGenreModel[]>;
    addGenre(section: MediaGenreCategory, name: string, signal?: AbortSignal): Promise<void>;
    protected processAddGenre(response: Response): Promise<void>;
    removeGenre(id: string, signal?: AbortSignal): Promise<void>;
    protected processRemoveGenre(response: Response): Promise<void>;
}
export declare class InteropProxyClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    connectToInterop(signal?: AbortSignal): Promise<void>;
    protected processConnectToInterop(response: Response): Promise<void>;
}
export declare class LoginClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    login(request: CredentialsRequest, signal?: AbortSignal): Promise<string>;
    protected processLogin(response: Response): Promise<string>;
}
export declare class MediaClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getDefault(signal?: AbortSignal): Promise<MediaModel>;
    protected processGetDefault(response: Response): Promise<MediaModel>;
    get(guid: string, signal?: AbortSignal): Promise<MediaModel>;
    protected processGet(response: Response): Promise<MediaModel>;
    getImageFor(guid: string, signal?: AbortSignal): Promise<FileResponse | null>;
    protected processGetImageFor(response: Response): Promise<FileResponse | null>;
    addMediaImage(image: string, guid: string, signal?: AbortSignal): Promise<void>;
    protected processAddMediaImage(response: Response): Promise<void>;
    deleteMediaImage(guid: string, signal?: AbortSignal): Promise<void>;
    protected processDeleteMediaImage(response: Response): Promise<void>;
    getAll(signal?: AbortSignal): Promise<MediaModel[]>;
    protected processGetAll(response: Response): Promise<MediaModel[]>;
    createFromMediaPath(request: MediaCreationRequest, signal?: AbortSignal): Promise<KeyValuePairOfNullableGuidAndModelCreationState>;
    protected processCreateFromMediaPath(response: Response): Promise<KeyValuePairOfNullableGuidAndModelCreationState>;
    updateMedia(id: string, _: UpdateRequestOfObject, signal?: AbortSignal): Promise<void>;
    protected processUpdateMedia(response: Response): Promise<void>;
    hardDeleteMedium(mediaId: string, signal?: AbortSignal): Promise<void>;
    protected processHardDeleteMedium(response: Response): Promise<void>;
    fullDeleteMedium(mediaId: string, signal?: AbortSignal): Promise<void>;
    protected processFullDeleteMedium(response: Response): Promise<void>;
    autoFillMediaDetails(animeId: string, signal?: AbortSignal): Promise<MediaModel>;
    protected processAutoFillMediaDetails(response: Response): Promise<MediaModel>;
}
export declare class MusicClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getDefault(signal?: AbortSignal): Promise<MusicModel>;
    protected processGetDefault(response: Response): Promise<MusicModel>;
    createMusicTrack(track: MusicModel, signal?: AbortSignal): Promise<string>;
    protected processCreateMusicTrack(response: Response): Promise<string>;
    createMusicTrackFromPath(trackPath: string, signal?: AbortSignal): Promise<KeyValuePairOfStringAndModelCreationState>;
    protected processCreateMusicTrackFromPath(response: Response): Promise<KeyValuePairOfStringAndModelCreationState>;
    recalculateHashes(signal?: AbortSignal): Promise<void>;
    protected processRecalculateHashes(response: Response): Promise<void>;
    getAll(signal?: AbortSignal): Promise<MusicModel[]>;
    protected processGetAll(response: Response): Promise<MusicModel[]>;
    get(hash: string, signal?: AbortSignal): Promise<MusicModel>;
    protected processGet(response: Response): Promise<MusicModel>;
    update(hash: string, _: UpdateRequestOfObject, signal?: AbortSignal): Promise<MusicModel>;
    protected processUpdate(response: Response): Promise<MusicModel>;
    getLyrics(hash: string, offset?: number | undefined, signal?: AbortSignal): Promise<LyricsResponse>;
    protected processGetLyrics(response: Response): Promise<LyricsResponse>;
    getInstruments(signal?: AbortSignal): Promise<InstrumentModel[]>;
    protected processGetInstruments(response: Response): Promise<InstrumentModel[]>;
    addInstrument(type: InstrumentType, name: string, signal?: AbortSignal): Promise<void>;
    protected processAddInstrument(response: Response): Promise<void>;
    removeInstrument(type: InstrumentType, name: string, signal?: AbortSignal): Promise<void>;
    protected processRemoveInstrument(response: Response): Promise<void>;
    softDeleteTracks(trackHashes: string[], signal?: AbortSignal): Promise<void>;
    protected processSoftDeleteTracks(response: Response): Promise<void>;
    undeleteTracks(trackHashes: string[], signal?: AbortSignal): Promise<void>;
    protected processUndeleteTracks(response: Response): Promise<void>;
    hardDeleteTracks(trackHashes: string[], signal?: AbortSignal): Promise<void>;
    protected processHardDeleteTracks(response: Response): Promise<void>;
}
export declare class PlaylistClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getDummyPlaylist(signal?: AbortSignal): Promise<PlaylistModel>;
    protected processGetDummyPlaylist(response: Response): Promise<PlaylistModel>;
    createTemporaryPlaylist(hashes: string[], signal?: AbortSignal): Promise<string>;
    protected processCreateTemporaryPlaylist(response: Response): Promise<string>;
    getPlaylist(playlistId: string, signal?: AbortSignal): Promise<PlaylistModel>;
    protected processGetPlaylist(response: Response): Promise<PlaylistModel>;
    updatePlaylistData(playlistId: string, updateRequest: UpdateRequestOfPlaylistModel, signal?: AbortSignal): Promise<void>;
    protected processUpdatePlaylistData(response: Response): Promise<void>;
    deletePlaylist(playlistId: string, signal?: AbortSignal): Promise<void>;
    protected processDeletePlaylist(response: Response): Promise<void>;
    listPlaylists(signal?: AbortSignal): Promise<PlaylistModel[]>;
    protected processListPlaylists(response: Response): Promise<PlaylistModel[]>;
    createPlaylist(playlist: PlaylistModel, signal?: AbortSignal): Promise<void>;
    protected processCreatePlaylist(response: Response): Promise<void>;
    addTracksToPlaylist(playlistId: string, trackHashes: string[], signal?: AbortSignal): Promise<void>;
    protected processAddTracksToPlaylist(response: Response): Promise<void>;
}
export declare class RecipeClient {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    getAllRecipes(signal?: AbortSignal): Promise<RecipeModel[]>;
    protected processGetAllRecipes(response: Response): Promise<RecipeModel[]>;
    createRecipe(recipe: RecipeModel, signal?: AbortSignal): Promise<void>;
    protected processCreateRecipe(response: Response): Promise<void>;
    updateRecipe(recipe: RecipeModel, signal?: AbortSignal): Promise<void>;
    protected processUpdateRecipe(response: Response): Promise<void>;
    getRecipe(id: string, signal?: AbortSignal): Promise<RecipeModel>;
    protected processGetRecipe(response: Response): Promise<RecipeModel>;
}
export declare class MusicModel implements IMusicModel {
    name: string;
    displayName: string;
    author: string | null;
    source: string | null;
    mood1: Mood;
    mood2: Mood;
    language: Language;
    instrumentation: Instrumentation;
    participants: Participants;
    instruments: InstrumentModel[];
    instrumentTypes: InstrumentType[];
    instrumentNames: string[];
    genres: MusicGenre[];
    path: string;
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
    name: string;
    displayName: string;
    author: string | null;
    source: string | null;
    mood1: Mood;
    mood2: Mood;
    language: Language;
    instrumentation: Instrumentation;
    participants: Participants;
    instruments: InstrumentModel[];
    instrumentTypes: InstrumentType[];
    instrumentNames: string[];
    genres: MusicGenre[];
    path: string;
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
    name: string;
    type: InstrumentType;
    constructor(data?: Partial<IInstrumentModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): InstrumentModel | null;
    toJSON(data?: any): any;
    clone(): InstrumentModel;
}
export interface IInstrumentModel {
    id: number;
    name: string;
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
    Flamenco = "Flamenco",
    Folk = "Folk",
    House = "House",
    Instrumental = "Instrumental",
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
    name: string;
    sectionName: string;
    constructor(data?: Partial<IGenreModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): GenreModel | null;
    toJSON(data?: any): any;
    clone(): GenreModel;
}
export interface IGenreModel {
    id: string;
    name: string;
    sectionName: string;
}
export declare class MediaGenreModel extends GenreModel implements IMediaGenreModel {
    sectionName: string;
    section: MediaGenreCategory;
    constructor(data?: Partial<IMediaGenreModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): MediaGenreModel | null;
    toJSON(data?: any): any;
    clone(): MediaGenreModel;
}
export interface IMediaGenreModel extends IGenreModel {
    sectionName: string;
    section: MediaGenreCategory;
}
export declare enum MediaGenreCategory {
    Relationship = "Relationship",
    Plot = "Plot",
    MainGenre = "MainGenre",
    JobsOrHobbies = "JobsOrHobbies",
    Battle = "Battle",
    Art = "Art",
    Location = "Location",
    Personalities = "Personalities",
    Protagonist = "Protagonist",
    School = "School",
    Sports = "Sports",
    Style = "Style",
    Beings = "Beings",
    Era = "Era",
    Mood = "Mood"
}
export declare class CredentialsRequest implements ICredentialsRequest {
    username: string;
    password: string;
    constructor(data?: Partial<ICredentialsRequest>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): CredentialsRequest | null;
    toJSON(data?: any): any;
    clone(): CredentialsRequest;
}
export interface ICredentialsRequest {
    username: string;
    password: string;
}
export declare class MediaModel implements IMediaModel {
    contentWarnings: ContentWarning[];
    description: string | null;
    genres: MediaGenreModel[];
    hash: string;
    name: string;
    romajiName: string | null;
    kanjiName: string | null;
    germanName: string | null;
    englishName: string | null;
    id: string;
    language: Language;
    rating: number;
    release: number;
    status: MediaStatus;
    targetGroup: TargetGroup;
    type: MediaCategory;
    rootFolderPath: string;
    deleted: boolean;
    complete: boolean;
    constructor(data?: Partial<IMediaModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): MediaModel | null;
    toJSON(data?: any): any;
    clone(): MediaModel;
}
export interface IMediaModel {
    contentWarnings: ContentWarning[];
    description: string | null;
    genres: MediaGenreModel[];
    hash: string;
    name: string;
    romajiName: string | null;
    kanjiName: string | null;
    germanName: string | null;
    englishName: string | null;
    id: string;
    language: Language;
    rating: number;
    release: number;
    status: MediaStatus;
    targetGroup: TargetGroup;
    type: MediaCategory;
    rootFolderPath: string;
    deleted: boolean;
    complete: boolean;
}
export declare enum ContentWarning {
    Depression = "Depression",
    Drugs = "Drugs",
    Violence = "Violence",
    Horror = "Horror",
    Gore = "Gore",
    Vulgarity = "Vulgarity",
    Sexuality = "Sexuality"
}
export declare enum MediaStatus {
    Completed = "Completed",
    Airing = "Airing",
    PreAiring = "PreAiring",
    Aborted = "Aborted",
    Incomplete = "Incomplete"
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
export declare class KeyValuePairOfNullableGuidAndModelCreationState implements IKeyValuePairOfNullableGuidAndModelCreationState {
    key: string | null;
    value: ModelCreationState;
    constructor(data?: Partial<IKeyValuePairOfNullableGuidAndModelCreationState>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): KeyValuePairOfNullableGuidAndModelCreationState | null;
    toJSON(data?: any): any;
    clone(): KeyValuePairOfNullableGuidAndModelCreationState;
}
export interface IKeyValuePairOfNullableGuidAndModelCreationState {
    key: string | null;
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
export declare class MediaCreationRequest implements IMediaCreationRequest {
    rootPath: string;
    category: MediaCategory;
    language: Language;
    entry: MediaModel | null;
    constructor(data?: Partial<IMediaCreationRequest>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): MediaCreationRequest | null;
    toJSON(data?: any): any;
    clone(): MediaCreationRequest;
}
export interface IMediaCreationRequest {
    rootPath: string;
    category: MediaCategory;
    language: Language;
    entry: MediaModel | null;
}
export declare class UpdateRequestOfObject implements IUpdateRequestOfObject {
    oldModel: any | null;
    newModel: any | null;
    constructor(data?: Partial<IUpdateRequestOfObject>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): UpdateRequestOfObject | null;
    toJSON(data?: any): any;
    clone(): UpdateRequestOfObject;
}
export interface IUpdateRequestOfObject {
    oldModel: any | null;
    newModel: any | null;
}
export declare class KeyValuePairOfStringAndModelCreationState implements IKeyValuePairOfStringAndModelCreationState {
    key: string | null;
    value: ModelCreationState;
    constructor(data?: Partial<IKeyValuePairOfStringAndModelCreationState>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): KeyValuePairOfStringAndModelCreationState | null;
    toJSON(data?: any): any;
    clone(): KeyValuePairOfStringAndModelCreationState;
}
export interface IKeyValuePairOfStringAndModelCreationState {
    key: string | null;
    value: ModelCreationState;
}
export declare class LyricsResponse implements ILyricsResponse {
    title: string;
    text: string;
    constructor(data?: Partial<ILyricsResponse>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): LyricsResponse | null;
    toJSON(data?: any): any;
    clone(): LyricsResponse;
}
export interface ILyricsResponse {
    title: string;
    text: string;
}
export declare class PlaylistModel implements IPlaylistModel {
    id: string;
    name: string;
    author: string | null;
    image: string | null;
    rating: number;
    language: Language;
    nation: Language;
    genres: MusicGenre[];
    complete: boolean;
    isTemporary: boolean;
    tracks: MusicModel[];
    constructor(data?: Partial<IPlaylistModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): PlaylistModel | null;
    toJSON(data?: any): any;
    clone(): PlaylistModel;
}
export interface IPlaylistModel {
    id: string;
    name: string;
    author: string | null;
    image: string | null;
    rating: number;
    language: Language;
    nation: Language;
    genres: MusicGenre[];
    complete: boolean;
    isTemporary: boolean;
    tracks: MusicModel[];
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
    title: string;
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
    ingredients: IngredientModel[];
    formattedText: string | null;
    constructor(data?: Partial<IRecipeModel>);
    init(_data?: any, _mappings?: any): void;
    static fromJS(data: any, _mappings?: any): RecipeModel | null;
    toJSON(data?: any): any;
    clone(): RecipeModel;
}
export interface IRecipeModel {
    id: string;
    title: string;
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
    ingredients: IngredientModel[];
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
    name: string;
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
    name: string;
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
