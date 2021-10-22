import { MessageDialog } from '../../dialogs/message-dialog/message-dialog.js';
import { PathInputDialog } from '../../dialogs/path-input-dialog/path-input-dialog.js';
import { html, render } from '../../exports.js';
import { FileService } from '../backend.services.js';

export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        var fileReader = new FileReader();
        fileReader.onload = async (fileData) => {
            var dataUrl = fileData.target.result;
            if (dataUrl instanceof ArrayBuffer) reject('the string must be an base64 image string');

            resolve(dataUrl);
        };

        fileReader.readAsDataURL(file);
    });
}

/**
 * @returns {Promise<{files:FileList, basePath:string}>}
 */
export function importFiles() {
    var folderBrowser = html` <input type="file" id="folder-browser" webkitdirectory style="display:none" /> `;
    var parentElement = document.createElement('div');
    document.body.append(parentElement);
    render(folderBrowser, parentElement);
    /** @type {HTMLInputElement} */ var folderInput = parentElement.querySelector('#folder-browser');
    folderInput.click();
    folderInput.focus();

    var folderSelected = false;
    return new Promise((resolve, reject) => {
        document.body.onfocus = () => {
            setTimeout(() => {
                if (!folderSelected) reject();
            }, 10000);
        };

        folderInput.addEventListener('change', (e) => {
            folderSelected = true;
            var pathDialog = PathInputDialog.show();
            pathDialog.addEventListener('accept', async (/** @type {CustomEvent<{ path: string }>} */ e) => {
                /** @type {string} */ var basePath = e.detail.path;
                var files = folderInput.files;

                var fileSources = [];
                var basePath = basePath.substring(0, basePath.lastIndexOf('\\'));
                for (var i = 0; i < folderInput.files.length; i++) {
                    // @ts-ignore
                    fileSources.push(`${basePath}\\${folderInput.files[i].webkitRelativePath}`.replaceAll('/', '\\'));
                }

                if (!(await FileService.validate(fileSources))) {
                    await MessageDialog.show(
                        'Ungültiger Basispfad!',
                        'Die Dateien konnten mit dem eingegebenen Basispfad nicht zurückverfolgt werden!'
                    );
                } else {
                    pathDialog.remove();
                    resolve({ files, basePath });
                }
            });

            pathDialog.addEventListener('decline', () => {
                pathDialog.remove();
                reject();
            });
        });
    });
}

/**
 * @param {File} file
 * @param {string} basePath
 */
export function analyzeMediaFile(file, basePath) {
    var streamingEntry = {};
    // @ts-ignore
    var fileLevels = file.webkitRelativePath.split('/');

    // @ts-ignore
    streamingEntry.src = `${basePath}\\${file.webkitRelativePath}`;
    streamingEntry.season = 'Staffel 1';
    if (fileLevels.length == 4) {
        streamingEntry.season = fileLevels[2];
        streamingEntry.name = fileLevels[1];
    } else if (fileLevels.length == 3) streamingEntry.name = fileLevels[1];
    else {
        // @ts-ignore
        var error = `the depth of the selected folder must be between 3 and 4 (root -> media -> (season) -> episode). file: ${file.webkitRelativePath}`;
        console.error(error);
        throw new Error(error);
    }

    return streamingEntry;
}
