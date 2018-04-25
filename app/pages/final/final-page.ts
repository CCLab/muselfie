import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { ImageAsset } from "image-asset"
import { Image } from "tns-core-modules/ui/image";

import * as bitmapFactory from "nativescript-bitmap-factory";

import { FinalModel } from "./final-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new FinalModel();
    }

    page.bindingContext.set("chosenBackgroundPath", page.navigationContext.chosenBackgroundPath);
    page.bindingContext.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
    page.bindingContext.set("faceDimensions", page.navigationContext.faceDimensions);
    page.bindingContext.set("placementDimensions", page.navigationContext.placementDimensions);
}

export function navigatedTo(args: NavigatedData) {
    const page = args.object as Page;
    const imageView = page.getViewById("image-final") as Image;
    const imageSize = imageView.getActualSize();
    const model = page.bindingContext as FinalModel;

    model.setFinalImage(imageSize);
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}


export function nextTap(args: NavigatedData) {
    // TODO
}
