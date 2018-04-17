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

    page.bindingContext.set("chosenImage", page.navigationContext.chosenImage);
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}

let multiFingerMode = false;
export function faceTouch(args: TouchGestureEventData) {
    const model = (args.object as View).bindingContext as FaceModel;
    console.log(`touch ${multiFingerMode} - ${args.action}`);

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
    console.log(`pan ${multiFingerMode} - ${args.state}`);
    if (!multiFingerMode && args.state === GestureStateTypes.changed) {
        model.moveFacePosition(args.deltaX, args.deltaY);
    }
}

export function nextTap(args: NavigatedData) {
    frameModule.topmost().navigate({
        moduleName: "pages/photo/photo-page",
        transition: { name: "slide" },
    });
}
