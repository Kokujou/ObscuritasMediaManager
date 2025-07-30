import { MediaGenreCategory, MediaGenreModel } from '../../obscuritas-media-manager-backend-client';

const MandatoryGenres = [
    MediaGenreCategory.MainGenre,
    MediaGenreCategory.Mood,
    MediaGenreCategory.Era,
    MediaGenreCategory.Location,
    MediaGenreCategory.Personalities,
    MediaGenreCategory.Plot,
    MediaGenreCategory.Protagonist,
    MediaGenreCategory.Style,
];

const MainGenreConditions: { [key: string]: MediaGenreCategory[] } = {
    'Slice of Life': [MediaGenreCategory.Art, MediaGenreCategory.JobsOrHobbies, MediaGenreCategory.School],
    Sport: [MediaGenreCategory.Sports],
    Action: [MediaGenreCategory.Battle],
    Fantasy: [MediaGenreCategory.Beings],
    Romance: [MediaGenreCategory.Relationship],
};

export function getAvailableGenreSections(selectedGenres: MediaGenreModel[]) {
    var baseSections = MandatoryGenres.concat(selectedGenres.map((x) => x.section));
    var selectedMainGenres = selectedGenres.filter((x) => x.section == MediaGenreCategory.MainGenre);
    for (var mainGenre of selectedMainGenres) baseSections = baseSections.concat(MainGenreConditions[mainGenre.name] ?? []);
    return baseSections.distinct();
}
