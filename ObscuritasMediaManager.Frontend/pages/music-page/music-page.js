import { MusicModel } from '../../data/music.model.js';
import { MessageDialog } from '../../dialogs/message-dialog/message-dialog.js';
import { PathInputDialog } from '../../dialogs/path-input-dialog/path-input-dialog.js';
import { LitElement } from '../../exports.js';
import { FileService } from '../../services/file.service.js';
import { renderMusicPageStyles } from './music-page.css.js';
import { renderMusicPage } from './music-page.html.js';

export class MusicPage extends LitElement {
    static get styles() {
        return renderMusicPageStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        document.title = 'Musik';
        /** @type {string} */ this.someProperty;
    }

    render() {
        return renderMusicPage(this);
    }

    importFolder() {
        /** @type {HTMLInputElement} */ var folderInput = this.shadowRoot.querySelector('#folder-browser');
        folderInput.click();
        folderInput.addEventListener('change', (e) => {
            var pathDialog = PathInputDialog.show();
            pathDialog.addEventListener('accept', async (/** @type {{ detail: { path: string; }; }} */ e) => {
                /** @type {string} */ var basePath = e.detail.path;
                var files = folderInput.files;

                var fileSources = [];
                var basePath = basePath.substring(0, basePath.lastIndexOf('\\'));
                for (var i = 0; i < folderInput.files.length; i++) {
                    // @ts-ignore
                    fileSources.push(`${basePath}\\${folderInput.files[i].webkitRelativePath}`.replaceAll('/', '\\'));
                }

                if (!(await FileService.validate(fileSources))) {
                    var messageDialog = MessageDialog.show(
                        'Ungültiger Basispfad!',
                        'Die Dateien konnten mit dem eingegebenen Basispfad nicht zurückverfolgt werden!'
                    );
                    messageDialog.addDefaultEventListeners();
                } else {
                    pathDialog.remove();
                    await MusicPage.processFiles(files, basePath);
                }
            });

            pathDialog.addEventListener('decline', () => pathDialog.remove());
        });
    }

    /**
     * @param {FileList} files
     * @param {string} basePath
     */
    static async processFiles(files, basePath) {
        var musickTracks = [];
        var streamingEntries = [];
        var episode = 0;
        for (var i = 0; i < files.length; i++) {
            try {
                var track = MusicModel.fromFile(files[i]);
                if (musickTracks.some((x) => x.name == track.name)) continue;
                musickTracks.push(track);
            } catch (err) {
                continue;
            }
        }

        try {
            await MusicService.batchCreateMusicTracks(musickTracks);
        } catch (err) {
            console.error(err);
        }
    }
}
