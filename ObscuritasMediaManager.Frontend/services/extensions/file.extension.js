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
