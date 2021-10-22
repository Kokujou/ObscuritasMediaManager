import { GenreModel } from '../../obscuritas-media-manager-backend-client.js';

export class GenreDialogResult {
    /** @type {GenreModel[]} */ acceptedGenres = [];
    /** @type {GenreModel[]} */ forbiddenGenres = [];
}
