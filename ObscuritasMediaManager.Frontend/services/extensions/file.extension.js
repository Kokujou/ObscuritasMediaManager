import { MessageDialog } from '../../dialogs/message-dialog/message-dialog.js';
import { PathInputDialog } from '../../dialogs/path-input-dialog/path-input-dialog.js';
import { html, render } from '../../exports.js';
import { FileService } from '../file.service.js';

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
            if (!folderSelected) reject();
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
