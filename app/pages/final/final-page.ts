import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { ImageAsset } from "image-asset"
import { Image } from "tns-core-modules/ui/image";
import { layout } from "utils/utils";

import * as bitmapFactory from "nativescript-bitmap-factory";

import { FinalModel } from "./final-model";

declare var android;

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new FinalModel();
    }

    page.bindingContext.set("chosenBackgroundPath", page.navigationContext.chosenBackgroundPath);
    page.bindingContext.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
}

/**
 * Scale a native Android bitmap to the desired width and height,
 */
function scaleBitmap(bitmap, width: number, height: number) {
    const m = new android.graphics.Matrix();
    console.log(width);
    console.log(layout.toDevicePixels(width));
    console.log(height);
    console.log(layout.toDevicePixels(height));


    m.setRectToRect(
        new android.graphics.RectF(0, 0, bitmap.getWidth(), bitmap.getHeight()),
        new android.graphics.RectF(0, 0, layout.toDevicePixels(width), layout.toDevicePixels(height)),
        android.graphics.Matrix.ScaleToFit.CENTER,
    );
    return android.graphics.Bitmap.createBitmap(
        bitmap,
        0,
        0,
        bitmap.getWidth(),
        bitmap.getHeight(),
        m,
        true,
    );
}

export function navigatedTo(args: NavigatedData) {
    const page = args.object as Page;
    const imageView = page.getViewById("image-final") as Image;
    const imageSize = imageView.getActualSize();

    let bmp = bitmapFactory.create(640, 480);
    const background = new ImageAsset(page.bindingContext.chosenBackgroundPath);
    background.getImageAsync(backgroundImage => {
        bmp.dispose(() => {
            const canvas = (bmp as any).__canvas;
            let scaledBackground = scaleBitmap(backgroundImage, imageSize.width, imageSize.height);
            canvas.drawBitmap(scaledBackground, 0, 0, null);
            page.bindingContext.set("finalImagePath", bmp.toDataUrl());
        })
    });
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}


export function nextTap(args: NavigatedData) {
    // TODO
}
