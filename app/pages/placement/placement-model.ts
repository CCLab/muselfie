import { Observable } from "data/observable";
import { screen } from "platform";
import * as bitmapFactory from "nativescript-bitmap-factory";
import { Size } from "ui/core/view";
import { layout } from "tns-core-modules/utils/utils";
import { ImageAsset } from "tns-core-modules/image-asset";
import { ImageSource } from "tns-core-modules/image-source";
import * as imageManipulation from "../../utils/image_manipulation";

declare var android;

export class PlacementModel extends Observable {
    public chosenPhotoPath = "";
    public chosenBackground;

    public finalImageSource: ImageSource;
    public faceDimensions: imageManipulation.OvalDimensions;
    public placementDimensions: imageManipulation.OvalDimensions;
    public backgroundData: string;
    public imageSize: Size;

    public placementX: number;
    public placementY: number;
    public placementWidth: number;
    public placementHeight: number;
    public placementRotation: number;

    private commitedPlacementWidth: number;
    private commitedPlacementHeight: number;
    private commitedPlacementX: number;
    private commitedPlacementY: number;
    private commitedPlacementRotation: number;

    constructor() {
        super();
        this.placementWidth = screen.mainScreen.widthDIPs * 0.4;
        this.placementHeight = screen.mainScreen.widthDIPs * 0.6;
        this.commitedPlacementWidth = this.placementWidth;
        this.commitedPlacementHeight = this.placementHeight;
        this.placementX = screen.mainScreen.widthDIPs * 0.3;
        this.placementY = screen.mainScreen.heightDIPs * 0.3 - (this.placementHeight / 2);
        this.commitedPlacementX = this.placementX;
        this.commitedPlacementY = this.placementY;
        this.commitedPlacementRotation = 0;
        this.placementRotation = this.commitedPlacementRotation;
    }

    /**
     * Create new image of previously selected part of the photo and save it in the model.
     */

    public setFaceImage() {
        const photo = new ImageAsset(this.chosenPhotoPath);
        photo.getImageAsync((nativePhoto) => {
            this.generateFaceImage(nativePhoto);
            nativePhoto.recycle();  // free the memory
        });
    }

    /**
     * The actual creation of the bitmap to be displayed as the oval background.
     */

    public generateFaceImage(nativePhoto) {
        const imageWidthPx = layout.toDevicePixels(this.imageSize.width);
        const imageHeightPx = layout.toDevicePixels(this.imageSize.height);
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
                nativePhoto,
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

            let destRect = new android.graphics.RectF(
                0, 0,
                imageWidthPx,
                imageHeightPx,
            );
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
            canvas.drawBitmap(nativePhoto, sourceRect, destRect, paint);

            this.set("backgroundData", bmp.toDataUrl(bitmapFactory.OutputFormat.JPEG, 25));
        });

    }

    public movePlacementPosition(x: number, y: number) {
        this.set("placementX", this.commitedPlacementX + x);
        this.set("placementY", this.commitedPlacementY + y);
    }

    public scalePlacementSize(factor: number) {
        this.set("placementWidth", this.commitedPlacementWidth * factor);
        this.set("placementHeight", this.commitedPlacementHeight * factor);
    }

    public setPlacementPosition(x: number, y: number) {
        this.set("placementX", x);
        this.set("placementY", y);
    }

    public setPlacementRotation(deg: number) {
        this.set("placementRotation", this.commitedPlacementRotation + deg);
    }

    public commitPlacementChanges() {
        this.set("commitedPlacementWidth", this.placementWidth);
        this.set("commitedPlacementHeight", this.placementHeight);
        this.set("commitedPlacementX", this.placementX);
        this.set("commitedPlacementY", this.placementY);
        this.set("commitedPlacementRotation", this.placementRotation);
    }
}
