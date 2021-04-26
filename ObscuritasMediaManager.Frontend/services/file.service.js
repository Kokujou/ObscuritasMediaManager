export class FileService {
    /** @param {string[]} files */
    static async validate(files) {
        var response = await fetch('https://localhost/ObscuritasMediaManager/api/file/validate-files', {
            method: 'POST',
            body: JSON.stringify(files),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 200) return false;
        return true;
    }
}
