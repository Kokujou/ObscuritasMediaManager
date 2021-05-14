export function getScaleFactorX() {
    return outerWidth / viewportWidth;
}
export function getScaleFactorY() {
    return (outerHeight - 90) / viewportHeight;
}

export const viewportWidth = 1920;
export const viewportHeight = 900;
