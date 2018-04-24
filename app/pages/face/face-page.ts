import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { PanGestureEventData, TouchGestureEventData, PinchGestureEventData, GestureStateTypes } from "ui/gestures";
import { View } from "tns-core-modules/ui/core/view";


import { FaceModel } from "./face-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new FaceModel();
    }

    page.bindingContext.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
    page.bindingContext.set("chosenBackgroundPath", page.navigationContext.chosenBackgroundPath);
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}

let multiFingerMode = false;
export function faceTouch(args: TouchGestureEventData) {
    const model = (args.object as View).bindingContext as FaceModel;

    if (args.action == "down") {
        multiFingerMode = (args.getPointerCount() !== 1);
    } else if (args.action == "up") {
        model.commitFaceChanges();
    }
}

export function facePinch(args: PinchGestureEventData) {
    const model = (args.object as View).bindingContext as FaceModel;
    if (args.state === GestureStateTypes.changed) {
        model.scaleFaceSize(args.scale);
        model.setFacePosition(args.getFocusX(), args.getFocusY());
    }
}

export function facePan(args: PanGestureEventData) {
    const model = (args.object as View).bindingContext as FaceModel;
    if (!multiFingerMode && args.state === GestureStateTypes.changed) {
        model.moveFacePosition(args.deltaX, args.deltaY);
    }
}

export function nextTap(args: NavigatedData) {
    const button = args.object as View;
    const page = button.page as Page;

    frameModule.topmost().navigate({
        moduleName: "pages/final/final-page",
        transition: { name: "slide" },
        context: {
            chosenPhotoPath: page.bindingContext.chosenPhotoPath,
            chosenBackgroundPath: page.bindingContext.chosenBackgroundPath,
        },
    });
}
