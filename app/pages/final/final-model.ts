import { Observable } from "data/observable";
import { Size } from "ui/core/view";
import {layout} from "tns-core-modules/utils/utils";
import * as bitmapFactory from "nativescript-bitmap-factory";
import {ImageAsset} from "tns-core-modules/image-asset";
import {ImageSource} from "tns-core-modules/image-source";
import * as imageManipulation from "../../utils/image_manipulation";

declare var android;

export class FinalModel extends Observable {
    public static BLUR_RADIUS = 10;

    public chosenPhotoPath = "";
    public chosenBackground;
    public finalImageSource: ImageSource;
    public faceDimensions: imageManipulation.OvalDimensions;
    public placementDimensions: imageManipulation.OvalDimensions;

    constructor() {
        super();
    }

    /**
     * Create the final collage and make it available.
     */
    public setFinalImage(imageSize: Size) {
        // Load the images
        const background = new ImageAsset(this.chosenBackground.path);
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
            const photoScale = imageManipulation.aspectFillSettings(
                photoNative,
                imageWidthPx,
                imageHeightPx,
            );

            let faceTopLeft = imageManipulation.fromScaledToOriginalCoordinates(
                photoScale,
                this.faceDimensions.x,
                this.faceDimensions.y,
            );
            let faceBottomRight = imageManipulation.fromScaledToOriginalCoordinates(
                photoScale,
                this.faceDimensions.x + this.faceDimensions.width,
                this.faceDimensions.y + this.faceDimensions.height,
            );
            let sourceRect = new android.graphics.Rect(
                faceTopLeft.x,
                faceTopLeft.y,
                faceBottomRight.x,
                faceBottomRight.y,
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
                ),
            );

            // Apply the placement rotation
            canvas.save(android.graphics.Canvas.MATRIX_SAVE_FLAG);
            canvas.rotate(
                this.placementDimensions.rotation,
                destRect.centerX(),
                destRect.centerY(),
            );

            // draw an oval that will be used as an mask when placing the face
            canvas.drawOval(destRect, paint);
            paint.setMaskFilter(null);

            // Add margins to face so there are additional pixels for blurring
            destRect.top -= FinalModel.BLUR_RADIUS;
            destRect.left -= FinalModel.BLUR_RADIUS;
            destRect.bottom += FinalModel.BLUR_RADIUS * 2;
            destRect.right += FinalModel.BLUR_RADIUS * 2;

            // This mode will put the face where the painted oval is
            paint.setXfermode(new android.graphics.PorterDuffXfermode(
                android.graphics.PorterDuff.Mode.SRC_IN,
            ));

            // painting the face

            // change the bounds of sourceRect and destRect to reflect the face rotation
            let rotationMatrix = new android.graphics.Matrix();
            let sourceRectTemp = new android.graphics.RectF(sourceRect);  // cast to a floating point rect
            rotationMatrix.setRotate(
                this.faceDimensions.rotation,
                sourceRect.centerX(),
                sourceRect.centerY(),
            );
            rotationMatrix.mapRect(sourceRectTemp);
            sourceRectTemp.round(sourceRect);  // save the result in sourceRect
            rotationMatrix.setRotate(
                this.faceDimensions.rotation,
                destRect.centerX(),
                destRect.centerY(),
            );
            rotationMatrix.mapRect(destRect);  // save the result in destRect

            // rotate canvas according to the face rotation
            canvas.save(android.graphics.Canvas.MATRIX_SAVE_FLAG);
            canvas.rotate(
                -this.faceDimensions.rotation,
                destRect.centerX(),
                destRect.centerY(),
            );
            canvas.drawBitmap(photoNative, sourceRect, destRect, paint);
            canvas.restore();  // restore the face rotation
            canvas.restore();  // restore the placement rotation

            // Add background
            paint.setXfermode(new android.graphics.PorterDuffXfermode(
                android.graphics.PorterDuff.Mode.DST_OVER,  // put below the existing stuff
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
        const settings = imageManipulation.aspectFillSettings(bitmap, width, height);

        matrix.preScale(settings.scale, settings.scale);
        matrix.postTranslate(settings.xTranslation, settings.yTranslation);
        return matrix;
    }
}
