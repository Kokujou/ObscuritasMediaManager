export class ImageCompressionService {
    static generateThumbnail(imageData: string, maxWidth: number, maxHeight: number) {
        const image = document.createElement('img');
        return new Promise<Blob>((resolve, reject) => {
            image.src = imageData;
            image.onerror = (e: ErrorEvent) => reject(e);
            image.onload = () => {
                // Berechne Zielgröße mit Erhaltung des Seitenverhältnisses
                let ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
                ratio = Math.min(ratio, 1); // nicht vergrößern

                const canvas = document.createElement('canvas');
                canvas.width = Math.round(image.width * ratio);
                canvas.height = Math.round(image.height * ratio);

                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                // Thumbnail als Blob (JPEG, Qualität 0.7)
                canvas.toBlob(
                    async (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
                    'image/jpeg',
                    0.7
                );
            };
        });
    }
}
