export class ImageCompressionService {
    static async generateThumbnail(imageData: string, maxWidth = 200, maxHeight = 200) {
        const blob = await fetch(imageData).then((r) => r.blob());

        const bitmap = await createImageBitmap(blob);

        const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);

        const canvas = new OffscreenCanvas(
            Math.max(1, Math.round(bitmap.width * ratio)),
            Math.max(1, Math.round(bitmap.height * ratio)),
        );

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no ctx');

        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        return await canvas.convertToBlob({
            type: 'image/jpeg',
            quality: 0.7,
        });
    }
}
