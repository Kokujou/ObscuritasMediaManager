declare global {
    interface Response {
        base64(): Promise<string>;
    }
}

Response.prototype.base64 = function (this: Response) {
    return new Promise(async (resolve) => {
        var reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(await this.blob());
    });
};

export function newGuid() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
}
