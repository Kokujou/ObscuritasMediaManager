export function createDummyAudio() {
    const sampleRate = 44100;
    const length = sampleRate; // 1 second silence

    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    const write = (o: number, s: string) => [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)));

    write(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    write(8, 'WAVE');

    write(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    write(36, 'data');
    view.setUint32(40, length * 2, true);

    return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}
