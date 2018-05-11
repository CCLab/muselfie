import { Observable } from "data/observable";
import { Size } from "ui/core/view";
import {layout} from "tns-core-modules/utils/utils";
import * as bitmapFactory from "nativescript-bitmap-factory";
import {ImageAsset} from "tns-core-modules/image-asset";
import {ImageSource} from "tns-core-modules/image-source";

declare var android;

interface OvalDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class FinalModel extends Observable {
    public static BLUR_RADIUS = 10;

    public chosenPhotoPath = "";
    public chosenBackgroundPath = "";
    public finalImageSource: ImageSource;
    public faceDimensions: OvalDimensions;
    public placementDimensions: OvalDimensions;

    constructor() {
        super();
    }

    /**
     * Create the final collage and make it available.
     */
    public setFinalImage(imageSize: Size) {
        // Load the images
        const background = new ImageAsset(this.chosenBackgroundPath);
        const photo = new ImageAsset(this.chosenPhotoPath);

        background.getImageAsync(backgroundNative => {
            photo.getImageAsync(photoNative => {
                if (backgroundNative && photoNative) {
                    this.createFinalBitmap(imageSize, backgroundNative, photoNative);
                }
            });
        });
    }

    /**
     * The actual creation of the bitmap to be displayed as the final image.
     */
    private createFinalBitmap(imageSize: Size, backgroundNative, photoNative) {
        const imageWidthPx = layout.toDevicePixels(imageSize.width);
        const imageHeightPx = layout.toDevicePixels(imageSize.height);

        // The bitmap
        let bmp = bitmapFactory.create(imageWidthPx, imageHeightPx);

        bmp.dispose(() => {
            // Main canvas
            const canvas = (bmp as any).__canvas;
            const paint = new android.graphics.Paint();
            paint.setFilterBitmap(true);
            paint.setDither(true);
            paint.setAntiAlias(true);

            // Add the face

            // What part of the photo to use?
            const photoScale = FinalModel.aspectFillSettings(
                photoNative,
                imageWidthPx,
                imageHeightPx,
            );
            let sourceRect = new android.graphics.Rect(
                (layout.toDevicePixels(this.faceDimensions.x) - photoScale.xTranslation
                ) / photoScale.scale,
                (layout.toDevicePixels(this.faceDimensions.y) - photoScale.yTranslation
                ) / photoScale.scale,
                (layout.toDevicePixels(
                    this.faceDimensions.x + this.faceDimensions.width) - photoScale.xTranslation
                ) / photoScale.scale,
                (layout.toDevicePixels(
                    this.faceDimensions.y + this.faceDimensions.height) - photoScale.yTranslation
                ) / photoScale.scale,
            );

            // Where to put the face?
            let destRect = new android.graphics.RectF(
                layout.toDevicePixels(this.placementDimensions.x),
                layout.toDevicePixels(this.placementDimensions.y),
                layout.toDevicePixels(this.placementDimensions.x + this.placementDimensions.width),
                layout.toDevicePixels(this.placementDimensions.y + this.placementDimensions.height),
            );

            // Blur face edges
            paint.setMaskFilter(
                new android.graphics.BlurMaskFilter(
                    FinalModel.BLUR_RADIUS,
                    android.graphics.BlurMaskFilter.Blur.NORMAL,
                )
            );
            canvas.drawOval(destRect, paint);
            paint.setMaskFilter(null);

            // Add margins to face so there are additional pixels for blurring
            destRect.top -= FinalModel.BLUR_RADIUS;
            destRect.left -= FinalModel.BLUR_RADIUS;
            destRect.bottom += FinalModel.BLUR_RADIUS * 2;
            destRect.right += FinalModel.BLUR_RADIUS * 2;

            // This mode will put the face where the painted oval is
            paint.setXfermode(new android.graphics.PorterDuffXfermode(
                android.graphics.PorterDuff.Mode.SRC_IN
            ));

            // paint the face
            canvas.drawBitmap(photoNative, sourceRect, destRect, paint);

            // Add background
            paint.setXfermode(new android.graphics.PorterDuffXfermode(
                android.graphics.PorterDuff.Mode.DST_OVER  // put below the existing stuff
            ));
            const backgroundScaleMatrix = FinalModel.aspectFillMatrix(
                backgroundNative,
                imageWidthPx,
                imageHeightPx,
            );
            canvas.drawBitmap(backgroundNative, backgroundScaleMatrix, paint);

            // Set in the context
            this.set("finalImageSource", bmp.clone().toImageSource());
        });
    }

    /**
     * Create a transformation Matrix that will aspect-fill the native bitmap into desired dimensions
     */
    public static aspectFillMatrix(bitmap, width: number, height: number) {
        const matrix = new android.graphics.Matrix();
        const settings = FinalModel.aspectFillSettings(bitmap, width, height);

        matrix.preScale(settings.scale, settings.scale);
        matrix.postTranslate(settings.xTranslation, settings.yTranslation);
        return matrix;
    }

    public static aspectFillSettings(bitmap, width: number, height: number) {
        let scale: number;
        let xTranslation = 0;
        let yTranslation = 0;
        const originalWidth = bitmap.getWidth();
        const originalHeight = bitmap.getHeight();
        const originalAspect = originalWidth / originalHeight;
        const newAspect = width / height;

        if (originalAspect > newAspect) {
            scale = height / originalHeight;
            xTranslation = (width - originalWidth * scale)/2;
        }
        else {
            scale = width / originalWidth;
            yTranslation = (height - originalHeight * scale)/2;
        }
        return {scale, xTranslation, yTranslation};
    }
}
