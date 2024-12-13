import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { InputDialog } from '../../dialogs/input-dialog/input-dialog';
import { FileService } from '../backend.services';

export function fileToDataUrl(file: File) {
    return new Promise<string | null>((resolve, reject) => {
        var fileReader = new FileReader();
        fileReader.onload = async (fileData) => {
            var dataUrl = fileData.target!.result;
            if (dataUrl instanceof ArrayBuffer) return reject('the string must be an base64 image string');

            resolve(btoa(dataUrl!));
        };

        fileReader.readAsBinaryString(file);
    });
}

export async function importDroppedFiles(files: File[]) {
    var basePath = await InputDialog.show('Bitte den Basispfad des ausgewählten Ordners eingeben:');
    if (!basePath) throw new Error();

    var fileSources = files.map((file) => `${basePath}\\${file.name}`.replaceAll('/', '\\'));

    if (!(await FileService.validate(fileSources)))
        await DialogBase.show('Ungültiger Basispfad!', {
            content: 'Die Dateien konnten mit dem eingegebenen Basispfad nicht zurückverfolgt werden!',
            declineActionText: 'Ok',
        });
    else return { files, basePath };
}
