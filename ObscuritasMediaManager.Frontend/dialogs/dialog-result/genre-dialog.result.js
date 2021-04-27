import { GenreModel } from '../../data/genre.model.js';

export class GenreDialogResult {
    /** @type {GenreModel[]} */ acceptedGenres = [];
    /** @type {GenreModel[]} */ forbiddenGenres = [];
}
