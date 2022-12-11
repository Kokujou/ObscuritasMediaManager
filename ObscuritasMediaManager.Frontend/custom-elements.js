import { AudioTileBase } from './advanced-components/audio-tile-base/audio-tile-base.js';
import { AudioTile } from './advanced-components/audio-tile-base/audio-tile/audio-tile.js';
import { DualSlider } from './advanced-components/dual-slider/dual-slider.js';
import { ExpandableDropdown } from './advanced-components/expandible-dropdown/expandable-dropdown.js';
import { ImageTile } from './advanced-components/image-tile/image-tile.js';
import { LanguageSwitcher } from './advanced-components/language-switcher/language-switcher.js';
import { MediaPlaylist } from './advanced-components/media-playlist/media-playlist.js';
import { MediaSearch } from './advanced-components/media-search/media-search.js';
import { MediaTile } from './advanced-components/media-tile/media-tile.js';
import { MusicFilter } from './advanced-components/music-filter/music-filter.js';
import { PaginatedScrolling } from './advanced-components/paginated-scrolling/paginated-scrolling.js';
import { StarRating } from './advanced-components/star-rating/star-rating.js';
import { TagLabel } from './advanced-components/tag-label/tag-label.js';
import { UploadArea } from './advanced-components/upload-area/upload-area.js';
import { DialogBase } from './dialogs/dialog-base/dialog-base.js';
import { GenreDialog } from './dialogs/genre-dialog/genre-dialog.js';
import { MessageDialog } from './dialogs/message-dialog/message-dialog.js';
import { PathInputDialog } from './dialogs/path-input-dialog/path-input-dialog.js';
import { PlayMusicDialog } from './dialogs/play-music-dialog/play-music-dialog.js';
import { SelectOptionsDialog } from './dialogs/select-options-dialog/select-options-dialog.js';
import { BorderButton } from './native-components/border-button/border-button.js';
import { CustomToggle } from './native-components/custom-toggle/custom-toggle.js';
import { DropDown } from './native-components/drop-down/drop-down.js';
import { EditableLabel } from './native-components/editable-label/editable-label.js';
import { FallbackAudio } from './native-components/fallback-audio/fallback-audio.js';
import { LinkElement } from './native-components/link-element/link-element.js';
import { MessageSnackbar } from './native-components/message-snackbar/message-snackbar.js';
import { PartialLoading } from './native-components/partial-loading/partial-loading.js';
import { RangeSlider } from './native-components/range-slider/range-slider.js';
import { ScrollSelect } from './native-components/scroll-seelect/scroll-select.js';
import { SideScroller } from './native-components/side-scroller/side-scroller.js';
import { TriValueCheckbox } from './native-components/tri-value-checkbox/tri-value-checkbox.js';
import { AnimeGerDubPage } from './pages/anime-ger-dub-page/anime-ger-dub-page.js';
import { AnimeGerSubPage } from './pages/anime-ger-sub-page/anime-ger-sub-page.js';
import { AnimeMoviesPage } from './pages/anime-movies-page/anime-movies-page.js';
import { JDramaPage } from './pages/jdrama-page/jdrama-page.js';
import { LoginPage } from './pages/login-page/login-page.js';
import { MediaDetailPage } from './pages/media-detail-page/media-detail-page.js';
import { MediaPage } from './pages/media-page/media-page.js';
import { MusicPage } from './pages/music-page/music-page.js';
import { MusicPlaylistPage } from './pages/music-playlist-page/music-playlist-page.js';
import { ObscuritasMediaManager } from './pages/obscuritas-media-manager/obscuritas-media-manager.js';
import { PageLayout } from './pages/page-layout/page-layout.js';
import { PageRouting } from './pages/page-routing/page-routing.js';
import { RealMoviesPage } from './pages/real-movies-page/real-movies-page.js';
import { RealSeriesPage } from './pages/real-series-page/real-series-page.js';
import { RecipesPage } from './pages/recipes-page/recipes-page.js';
import { VideoPlayerPopup } from './pages/video-player-popup/video-player-popup.js';
import { WelcomePage } from './pages/welcome-page/welcome-page.js';
import { pascalToKeabCase } from './services/extensions/convention.extension.js';
import { getPageName } from './services/extensions/url.extension.js';

/** @type {(CustomElementConstructor | (CustomElementConstructor & {isPage: boolean}))[]} */
export const RegisteredComponents = [
    ObscuritasMediaManager,
    PageRouting,
    WelcomePage,
    PageLayout,
    ImageTile,
    AnimeGerSubPage,
    DualSlider,
    ExpandableDropdown,
    DialogBase,
    MessageDialog,
    BorderButton,
    GenreDialog,
    TriValueCheckbox,
    MediaSearch,
    MediaTile,
    TagLabel,
    MediaDetailPage,
    PathInputDialog,
    UploadArea,
    VideoPlayerPopup,
    MediaPage,
    AnimeGerDubPage,
    AnimeMoviesPage,
    RealSeriesPage,
    RealMoviesPage,
    JDramaPage,
    MusicPage,
    AudioTile,
    SideScroller,
    PaginatedScrolling,
    RangeSlider,
    MusicPlaylistPage,
    ScrollSelect,
    EditableLabel,
    MusicFilter,
    DropDown,
    LanguageSwitcher,
    MediaPlaylist,
    StarRating,
    CustomToggle,
    AudioTileBase,
    LinkElement,
    PartialLoading,
    SelectOptionsDialog,
    PlayMusicDialog,
    FallbackAudio,
    LoginPage,
    MessageSnackbar,
    RecipesPage,
];

export const Pages = Object.fromEntries(
    // @ts-ignore
    RegisteredComponents.filter((x) => x.isPage).map((x) => [
        // @ts-ignore
        getPageName(x),
        `<${pascalToKeabCase(x.name)}></${pascalToKeabCase(x.name)}>`,
    ])
);

for (var element of RegisteredComponents) {
    window.customElements.define(pascalToKeabCase(element.name), element);
}
