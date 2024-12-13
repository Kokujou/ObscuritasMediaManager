import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { ContextMenu, ContextMenuItem } from '../../native-components/context-menu/context-menu';
import { GenreModel, MediaGenreModel, MediaModel } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { renderMediaTileStyles } from './media-tile.css';
import { renderMediaTile } from './media-tile.html';

@customElement('media-tile')
export class MediaTile extends LitElementBase {
    static override get styles() {
        return renderMediaTileStyles();
    }

    @property() public declare displayStyle: string;
    @property({ type: Object }) public declare media: MediaModel;
    @property({ type: Array }) public declare autocompleteGenres: string[] | undefined;

    @state() protected declare imageRevision: number;
    @state() protected declare hoveredRating: number;
    @state() protected declare hasImage: boolean;

    constructor() {
        super();
        this.displayStyle = 'solid';
        this.imageRevision = Date.now();
        this.media = new MediaModel();
    }

    override async connectedCallback() {
        super.connectedCallback();

        this.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const contextItems: ContextMenuItem[] = [];

            const softDeleteItem: ContextMenuItem = {
                icon: Icons.Trash,
                text: 'In Papierkorb verschieben',
                action: () => this.dispatchEvent(new CustomEvent('soft-delete')),
            };
            const hardDeleteItem: ContextMenuItem = {
                icon: Icons.Trash,
                text: 'Aus Datenbank löschen',
                action: () => this.dispatchEvent(new CustomEvent('hard-delete')),
            };
            const fullDeleteItem: ContextMenuItem = {
                icon: Icons.Trash,
                text: 'Vollständig Löschen',
                action: () => this.dispatchEvent(new CustomEvent('full-delete')),
            };
            const undeleteItem: ContextMenuItem = {
                icon: Icons.Revert,
                text: 'Wiederherstellen',
                action: () => this.dispatchEvent(new CustomEvent('undelete')),
            };

            if (this.media.deleted) contextItems.push(hardDeleteItem, fullDeleteItem, undeleteItem);
            else contextItems.push(softDeleteItem);

            ContextMenu.popup(contextItems, e);
        });
    }

    override render() {
        return renderMediaTile.call(this);
    }

    addGenre(genre: MediaGenreModel) {
        if (!genre) return;
        if (genre) this.media.genres = this.media.genres.filter((x) => x);

        if (!genre) {
            this.media.genres.push(genre);
            this.requestFullUpdate();
            return;
        }

        this.notifyGenresChanged(this.media.genres.concat(genre), null);
    }

    notifyRatingChanged(newRating: number, e: Event) {
        e.stopPropagation();
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: { newRating: newRating } }));
    }

    notifyGenresChanged(genres: GenreModel[], e: Event | null) {
        e?.stopPropagation();
        this.dispatchEvent(new CustomEvent('genresChanged', { detail: { genres: genres } }));
    }

    notifyImageAdded(imageData: string) {
        this.dispatchEvent(new CustomEvent('imageReceived', { detail: { imageData: imageData } }));
    }
}
