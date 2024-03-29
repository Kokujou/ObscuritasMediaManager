import { MediaGenreCategory, MediaGenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { distinct } from '../../services/extensions/array.extensions.js';

const MandatoryGenres = [
    MediaGenreCategory.MainGenre,
    MediaGenreCategory.Era,
    MediaGenreCategory.Location,
    MediaGenreCategory.Personalities,
    MediaGenreCategory.Plot,
    MediaGenreCategory.Protagonist,
    MediaGenreCategory.Style,
];

const MainGenreConditions = {
    'Slice of Life': [MediaGenreCategory.Art, MediaGenreCategory.JobsOrHobbies, MediaGenreCategory.School],
    Sport: [MediaGenreCategory.Sports],
    Action: [MediaGenreCategory.Battle],
    Fantasy: [MediaGenreCategory.Beings],
    Romance: [MediaGenreCategory.Relationship],
};

/**
 * @param {MediaGenreModel[]} selectedGenres
 */
export function getAvailableGenreSections(selectedGenres) {
    var baseSections = MandatoryGenres.concat(selectedGenres.map((x) => x.section));
    var selectedMainGenres = selectedGenres.filter((x) => x.section == MediaGenreCategory.MainGenre);
    for (var mainGenre of selectedMainGenres) baseSections = baseSections.concat(MainGenreConditions[mainGenre.name] ?? []);
    return distinct(baseSections);
}
