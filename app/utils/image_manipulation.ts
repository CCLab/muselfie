import { layout } from "tns-core-modules/utils/utils";

export interface OvalDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

export interface PhotoScale {
    scale: number;
    xTranslation: number;
    yTranslation: number;
}

export function aspectFillSettings(photo, width: number, height: number): PhotoScale {
    let scale: number;
    let xTranslation = 0;
    let yTranslation = 0;
    const originalWidth = photo.getWidth();
    const originalHeight = photo.getHeight();
    const originalAspect = originalWidth / originalHeight;
    const newAspect = width / height;

    if (originalAspect > newAspect) {
        scale = height / originalHeight;
        xTranslation = (width - originalWidth * scale) / 2;
    }
    else {
        scale = width / originalWidth;
        yTranslation = (height - originalHeight * scale) / 2;
    }
    return { scale, xTranslation, yTranslation };
}

/**
 * Takes coordinates in the coordinate system of a scaled on-screen image (in dip) and returns
 * coordinates in the coordinate systems of the original image (in px).
 * photoScale is an object containing scaling settings returned by aspectFillSettings.
 */
export function fromScaledToOriginalCoordinates(photoScale: PhotoScale, x, y) {
    let newX = (layout.toDevicePixels(x) - photoScale.xTranslation) / photoScale.scale;
    let newY = (layout.toDevicePixels(y) - photoScale.yTranslation) / photoScale.scale;
    return { x: newX, y: newY };
}
