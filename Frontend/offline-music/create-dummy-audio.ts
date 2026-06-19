// Returns a blob URL for a short silent PCM WAV (0.5s, 8kHz, mono, 16-bit).
// WAV/PCM is the one format guaranteed to be natively decoded on all iOS versions
// without a codec step. Kept short to minimize memory; 8kHz is the lowest rate iOS accepts.
export function createSilentWav(): string {
    const sampleRate = 8000;
    const numSamples = sampleRate / 2; // 0.5 seconds
    const dataBytes = numSamples * 2;  // 16-bit = 2 bytes per sample

    const buffer = new ArrayBuffer(44 + dataBytes);
    const v = new DataView(buffer);
    const txt = (offset: number, s: string) => [...s].forEach((c, i) => v.setUint8(offset + i, c.charCodeAt(0)));

    txt(0, 'RIFF');
    v.setUint32(4, 36 + dataBytes, true);  // file size - 8
    txt(8, 'WAVE');
    txt(12, 'fmt ');
    v.setUint32(16, 16, true);             // fmt chunk size
    v.setUint16(20, 1, true);              // PCM
    v.setUint16(22, 1, true);              // mono
    v.setUint32(24, sampleRate, true);
    v.setUint32(28, sampleRate * 2, true); // byte rate = rate * channels * (bits/8)
    v.setUint16(32, 2, true);              // block align
    v.setUint16(34, 16, true);             // bits per sample
    txt(36, 'data');
    v.setUint32(40, dataBytes, true);
    // data section stays all-zeros = silence

    return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}
