import { SortingProperties } from '../../data/music-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';

export class MusicSorting {
    public direction: keyof typeof SortingDirections = 'ascending';
    public property: SortingProperties = 'unset';
    public randomizeGroups: boolean = false;
}
