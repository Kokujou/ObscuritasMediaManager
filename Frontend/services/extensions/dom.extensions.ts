export {};

declare global {
    interface Document {
        openFileBrowser(accept: string): Promise<FileList | null>;
    }
}

Document.prototype.openFileBrowser = function (accept: string, multiple = true) {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept;
    fileInput.hidden = true;
    fileInput.multiple = multiple;

    document.body.appendChild(fileInput);

    fileInput.click();

    return new Promise((resolve) => {
        fileInput.addEventListener('change', () => {
            resolve(fileInput.files);
        });
    });
};
