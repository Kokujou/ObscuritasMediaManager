import { AudioTileBase } from './advanced-components/audio-tile-base/audio-tile-base.js';
import { AudioTile } from './advanced-components/audio-tile-base/audio-tile/audio-tile.js';
import { DualSlider } from './advanced-components/dual-slider/dual-slider.js';
import { DurationInput } from './advanced-components/duration-input/duration-input.js';
import { ExpandableDropdown } from './advanced-components/expandible-dropdown/expandable-dropdown.js';
import { ImageTile } from './advanced-components/image-tile/image-tile.js';
import { LanguageSwitcher } from './advanced-components/language-switcher/language-switcher.js';
import { MediaFilterSidebar } from './advanced-components/media-filter-sidebar/media-filter-sidebar.js';
import { MediaPlaylist } from './advanced-components/media-playlist/media-playlist.js';
import { MediaTile } from './advanced-components/media-tile/media-tile.js';
import { MusicFilter } from './advanced-components/music-filter/music-filter.js';
import { PaginatedScrolling } from './advanced-components/paginated-scrolling/paginated-scrolling.js';
import { PlaylistTile } from './advanced-components/playlist-tile/playlist-tile.js';
import { RecipeTile } from './advanced-components/recipe-tile/recipe-tile.js';
import { StarRating } from './advanced-components/star-rating/star-rating.js';
import { UploadArea } from './advanced-components/upload-area/upload-area.js';
import { LitElementBase } from './data/lit-element-base.js';
import { LyricsDialog } from './dialogs/audio-subtitle-dialog/lyrics-dialog.js';
import { DialogBase } from './dialogs/dialog-base/dialog-base.js';
import { EditPlaylistDialog } from './dialogs/edit-playlist-dialog/edit-playlist-dialog.js';
import { GenreDialog } from './dialogs/genre-dialog/genre-dialog.js';
import { InputDialog } from './dialogs/input-dialog/input-dialog.js';
import { PlayMusicDialog } from './dialogs/play-music-dialog/play-music-dialog.js';
import { PlaylistSelectionDialog } from './dialogs/playlist-selection-dialog/playlist-selection-dialog.js';
import { SelectOptionsDialog } from './dialogs/select-options-dialog/select-options-dialog.js';
import { html, TemplateResult } from './exports.js';
import { BorderButton } from './native-components/border-button/border-button.js';
import { ContextMenu } from './native-components/context-menu/context-menu.js';
import { CustomToggle } from './native-components/custom-toggle/custom-toggle.js';
import { CustomTooltip } from './native-components/custom-tooltip/custom-tooltip.js';
import { DropDown } from './native-components/drop-down/drop-down.js';
import { GroupedDropdown } from './native-components/grouped-dropdown/grouped-dropdown.js';
import { LinkElement } from './native-components/link-element/link-element.js';
import { MessageSnackbar } from './native-components/message-snackbar/message-snackbar.js';
import { OrderedList } from './native-components/ordered-list/ordered-list.js';
import { PartialLoading } from './native-components/partial-loading/partial-loading.js';
import { PriorityList } from './native-components/priority-list/priority-list.js';
import { RangeSelector } from './native-components/range-selector/range-selector.js';
import { RangeSlider } from './native-components/range-slider/range-slider.js';
import { ScrollSelect } from './native-components/scroll-seelect/scroll-select.js';
import { SideScroller } from './native-components/side-scroller/side-scroller.js';
import { TagLabel } from './native-components/tag-label/tag-label.js';
import { TriValueCheckbox } from './native-components/tri-value-checkbox/tri-value-checkbox.js';
import { CreateRecipePage } from './pages/create-recipe-page/create-recipe-page.js';
import { LoginPage } from './pages/login-page/login-page.js';
import { MediaDetailPage } from './pages/media-detail-page/media-detail-page.js';
import { MediaPage } from './pages/media-page/media-page.js';
import { MusicPage } from './pages/music-page/music-page.js';
import { MusicPlaylistPage } from './pages/music-playlist-page/music-playlist-page.js';
import { ObscuritasMediaManager } from './pages/obscuritas-media-manager/obscuritas-media-manager.js';
import { PageLayout } from './pages/page-layout/page-layout.js';
import { PageRouting } from './pages/page-routing/page-routing.js';
import { RecipesPage } from './pages/recipes-page/recipes-page.js';
import { VideoPlayerPopup } from './pages/video-player-popup/video-player-popup.js';
import { WelcomePage } from './pages/welcome-page/welcome-page.js';
import { getPageName } from './services/extensions/url.extension.js';

/**
 * @typedef {Object} Page
 * @property {typeof LitElementBase & {isPage: boolean, pageName: string, icon: string}} element
 * @property {string} hash
 * @property {string} title
 * @property {TemplateResult} template
 * @property {string} tagName
 */

/** @type {Page[]} */ export const Pages = [];

const define = window.customElements.define.bind(window.customElements);
window.customElements.define = (name, element) => {
    define(name, element);
    if (!element.isPage) return;

    Pages.push({
        element: element,
        hash: getPageName(element),
        tagName: element.name,
        template: html([`<${name}></${name}>`]),
        title: element.pageName,
    });
};

window.customElements.define('obscuritas-media-manager', ObscuritasMediaManager);
window.customElements.define('page-routing', PageRouting);
window.customElements.define('welcome-page', WelcomePage);
window.customElements.define('page-layout', PageLayout);
window.customElements.define('image-tile', ImageTile);
window.customElements.define('dual-slider', DualSlider);
window.customElements.define('expandable-dropdown', ExpandableDropdown);
window.customElements.define('dialog-base', DialogBase);
window.customElements.define('border-button', BorderButton);
window.customElements.define('genre-dialog', GenreDialog);
window.customElements.define('tri-value-checkbox', TriValueCheckbox);
window.customElements.define('media-tile', MediaTile);
window.customElements.define('tag-label', TagLabel);
window.customElements.define('media-detail-page', MediaDetailPage);
window.customElements.define('path-input-dialog', InputDialog);
window.customElements.define('upload-area', UploadArea);
window.customElements.define('video-player-popup', VideoPlayerPopup);
window.customElements.define('media-page', MediaPage);
window.customElements.define('music-page', MusicPage);
window.customElements.define('audio-tile', AudioTile);
window.customElements.define('side-scroller', SideScroller);
window.customElements.define('paginated-scrolling', PaginatedScrolling);
window.customElements.define('range-slider', RangeSlider);
window.customElements.define('music-playlist-page', MusicPlaylistPage);
window.customElements.define('scroll-select', ScrollSelect);
window.customElements.define('music-filter', MusicFilter);
window.customElements.define('drop-down', DropDown);
window.customElements.define('language-switcher', LanguageSwitcher);
window.customElements.define('media-playlist', MediaPlaylist);
window.customElements.define('star-rating', StarRating);
window.customElements.define('custom-toggle', CustomToggle);
window.customElements.define('audio-tile-base', AudioTileBase);
window.customElements.define('link-element', LinkElement);
window.customElements.define('partial-loading', PartialLoading);
window.customElements.define('select-options-dialog', SelectOptionsDialog);
window.customElements.define('play-music-dialog', PlayMusicDialog);
window.customElements.define('login-page', LoginPage);
window.customElements.define('message-snackbar', MessageSnackbar);
window.customElements.define('recipes-page', RecipesPage);
window.customElements.define('create-recipe-page', CreateRecipePage);
window.customElements.define('grouped-dropdown', GroupedDropdown);
window.customElements.define('duration-input', DurationInput);
window.customElements.define('recipe-tile', RecipeTile);
window.customElements.define('priority-list', PriorityList);
window.customElements.define('playlist-tile', PlaylistTile);
window.customElements.define('edit-playlist-dialog', EditPlaylistDialog);
window.customElements.define('ordered-list', OrderedList);
window.customElements.define('playlist-selection-dilaog', PlaylistSelectionDialog);
window.customElements.define('media-filter-sidebar', MediaFilterSidebar);
window.customElements.define('range-selector', RangeSelector);
window.customElements.define('custom-tooltip', CustomTooltip);
window.customElements.define('context-menu', ContextMenu);
window.customElements.define('lyrics-dialog', LyricsDialog);
