import { InputDialog } from '../../dialogs/input-dialog/input-dialog.js';
import { MessageDialog } from '../../dialogs/message-dialog/message-dialog.js';
import { FileService } from '../backend.services.js';
import { openFileDialog } from './document.extensions.js';

/**
 * @param {File} file
 * @returns
 */
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
export async function importFiles() {
    var files = await openFileDialog(true);
    var basePath = await InputDialog.show('Bitte den Basispfad des ausgewählten Ordners eingeben:');
    if (!basePath) throw new Error();

    var fileSources = [];
    var basePath = basePath.substring(0, basePath.lastIndexOf('\\'));
    for (var i = 0; i < files.length; i++) {
        // @ts-ignore
        fileSources.push(`${basePath}\\${files[i].webkitRelativePath}`.replaceAll('/', '\\'));
    }

    if (!(await FileService.validate(fileSources)))
        await MessageDialog.show(
            'Ungültiger Basispfad!',
            'Die Dateien konnten mit dem eingegebenen Basispfad nicht zurückverfolgt werden!'
        );
    else return { files, basePath };
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
