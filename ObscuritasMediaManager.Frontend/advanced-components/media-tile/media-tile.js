import { LitElementBase } from '../../data/lit-element-base.js';
import { ContextMenu, ContextMenuItem } from '../../native-components/context-menu/context-menu.js';
import { GenreModel, MediaModel } from '../../obscuritas-media-manager-backend-client.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { renderMediaTileStyles } from './media-tile.css.js';
import { renderMediaTile } from './media-tile.html.js';

export class MediaTile extends LitElementBase {
    static get styles() {
        return renderMediaTileStyles();
    }

    static get properties() {
        return {
            displayStyle: { type: String, reflect: true },
            media: { type: Object, reflect: true },
            autocompleteGenres: { type: Array, reflect: true },
            disabled: { type: Boolean, reflect: true },

            hoveredRating: { type: Number, reflect: false },
        };
    }

    constructor() {
        super();

        /** @type {string} */ this.displayStyle = 'solid';
        /** @type {MediaModel} */ this.media = new MediaModel();
        /** @type {string[]} */ this.autocompleteGenres = [];

        /** @type {number} */ this.hoveredRating = 0;
    }

    async connectedCallback() {
        super.connectedCallback();

        this.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            /** @type {ContextMenuItem[]} */ const contextItems = [];

            /** @type {ContextMenuItem} */ const softDeleteItem = {
                icon: Icons.Trash,
                text: 'In Papierkorb verschieben',
                action: () => this.dispatchEvent(new CustomEvent('soft-delete')),
            };
            /** @type {ContextMenuItem} */ const hardDeleteItem = {
                icon: Icons.Trash,
                text: 'Aus Datenbank löschen',
                action: () => this.dispatchEvent(new CustomEvent('hard-delete')),
            };
            /** @type {ContextMenuItem} */ const fullDeleteItem = {
                icon: Icons.Trash,
                text: 'Vollständig Löschen',
                action: () => this.dispatchEvent(new CustomEvent('full-delete')),
            };
            /** @type {ContextMenuItem} */ const undeleteItem = {
                icon: Icons.Revert,
                text: 'Wiederherstellen',
                action: () => this.dispatchEvent(new CustomEvent('undelete')),
            };

            if (this.media.deleted) contextItems.push(hardDeleteItem, fullDeleteItem, undeleteItem);
            else contextItems.push(softDeleteItem);

            ContextMenu.popup(contextItems, e);
        });
    }

    render() {
        return renderMediaTile(this);
    }
    /**
     * @param {GenreModel} genre
     */
    addGenre(genre) {
        if (!genre) return;
        if (genre) this.media.genres = this.media.genres.filter((x) => x);

        if (!genre) {
            this.media.genres.push(genre);
            this.requestFullUpdate();
            return;
        }

        this.notifyGenresChanged(this.media.genres.concat(genre), null);
    }

    /**
     * @param {number} newRating
     * @param {Event} e
     */
    notifyRatingChanged(newRating, e) {
        e.stopPropagation();
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: { newRating: newRating } }));
    }

    /**
     * @param {GenreModel[]} genres
     * @param {Event} e
     */
    notifyGenresChanged(genres, e) {
        e?.stopPropagation();
        this.dispatchEvent(new CustomEvent('genresChanged', { detail: { genres: genres } }));
    }

    notifyImageAdded(imageData) {
        this.dispatchEvent(new CustomEvent('imageReceived', { detail: { imageData: imageData } }));
    }
}
