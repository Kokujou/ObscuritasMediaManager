import { SortingProperties } from '../../data/music-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';

export class MusicSorting {
    public declare direction: keyof typeof SortingDirections;
    public declare property: SortingProperties;
    public declare randomizeGroups: boolean;
}
