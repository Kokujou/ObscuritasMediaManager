// @ts-nocheck

class SampleProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferLength = 1024;
        this.sampleBuffer = new Float32Array(this.bufferLength);
        this.samplePos = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];

        if (input.length > 0) {
            const samples = input[0];
            for (let i = 0; i < samples.length; i++) {
                this.sampleBuffer[this.samplePos++] = samples[i];
                if (this.samplePos >= this.bufferLength) {
                    this.samplePos = 0;
                    this.port.postMessage(this.sampleBuffer.slice()); // Chunk senden
                }
            }
        }

        return true;
    }
}

registerProcessor('sample-processor', SampleProcessor);
