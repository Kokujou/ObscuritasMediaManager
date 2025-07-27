import {
    IngredientModel,
    InstrumentModel,
    MediaModel,
    MusicModel,
    RecipeModel,
} from '../obscuritas-media-manager-backend-client';
import { MediaService, MusicService, RecipeService } from '../services/backend.services';
import { Observable } from './observable';

export class Session {
    static currentPage = new Observable('');
    static mediaList = new Observable<MediaModel[]>([]);
    static tracks = new Observable<MusicModel[]>([]);
    static recipes = new Observable<RecipeModel[]>([]);
    static ingredients = new Observable<IngredientModel[]>([]);
    static instruments = new Observable<InstrumentModel[]>([]);

    private declare static _favoriteIngredients: string[];
    static get favoriteIngredients() {
        this._favoriteIngredients ??= JSON.parse(localStorage.getItem('favoriteIngredients') ?? '[]') as string[];
        return this._favoriteIngredients;
    }
    static set favoriteIngredients(value) {
        localStorage.setItem('favoriteIngredients', JSON.stringify(value));
        this._favoriteIngredients = value;
    }

    static initialized = false;
    static async initialize() {
        Session.initialized = false;

        var promises = [
            MediaService.getAll()
                .then((list) => Session.mediaList.next(list))
                .catch((err) => console.error(err)),
            MusicService.getAll()
                .then((list) => Session.tracks.next(list))
                .catch((err) => console.error(err)),
            MusicService.getInstruments()
                .then((list) => Session.instruments.next(list))
                .catch((err) => console.error(err)),
            RecipeService.getAllRecipes()
                .then((list) => Session.recipes.next(list))
                .catch((err) => console.error(err)),
            RecipeService.getIngredients()
                .then((list) => Session.ingredients.next(list))
                .catch((err) => console.error(err)),
        ];

        for (var promise of promises) await promise;

        Session.initialized = true;
    }
}
await Session.initialize();
