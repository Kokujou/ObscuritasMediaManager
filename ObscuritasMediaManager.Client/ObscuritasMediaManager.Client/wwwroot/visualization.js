/**
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} visualizationData
 */
function renderVisualization(canvas, visualizationData) {
    var canvasContext = canvas.getContext('2d');

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    if (!visualizationData) return;

    // Zeichnen Sie die Audiodaten
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = 'white';
    canvasContext.beginPath();

    const sliceWidth = (canvas.width - 40.0) / visualizationData.length;
    let x = 20;
    canvasContext.moveTo(0, canvas.height / 2);
    canvasContext.lineTo(x, canvas.height / 2);

    for (let i = 0; i < visualizationData.length; i++) {
        const y = canvas.height / 2 + visualizationData[i] * canvas.height;
        canvasContext.lineTo(x, y);
        x += sliceWidth;
    }
    canvasContext.lineTo(canvas.width - 20, canvas.height / 2);
    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.stroke();
}