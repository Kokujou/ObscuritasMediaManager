import { GenreModel } from '../data/genre.model.js';

export class GenreService {
    /** @returns {Promise<GenreModel[]>} */
    static async getGenreList() {
        try {
            var response = await fetch('/ObscuritasMediaManager/api/genre');
            if (response.status != 200) throw { status: response.status };
            return await response.json();
        } catch (err) {}
    }
}
