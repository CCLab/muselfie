import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { PanGestureEventData, TouchGestureEventData, PinchGestureEventData, GestureStateTypes, RotationGestureEventData } from "ui/gestures";
import { View } from "tns-core-modules/ui/core/view";
import { FaceModel } from "./face-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new FaceModel();
    }

    page.bindingContext.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
    page.bindingContext.set("chosenBackground", page.navigationContext.chosenBackground);
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
        model.setFacePosition(
            args.getFocusX() - model.faceWidth / 2,
            args.getFocusY() - model.faceHeight / 2,
        );
    }
}

export function facePan(args: PanGestureEventData) {
    const model = (args.object as View).bindingContext as FaceModel;
    if (!multiFingerMode && args.state === GestureStateTypes.changed) {
        model.moveFacePosition(args.deltaX, args.deltaY);
    }
}

export function faceRotation(args: RotationGestureEventData) {
    const model = (args.object as View).bindingContext as FaceModel;
    model.setFaceRotation(args.rotation);
}

export function nextTap(args: NavigatedData) {
    const button = args.object as View;
    const page = button.page as Page;
    const model = page.bindingContext as FaceModel;
    frameModule.topmost().navigate({
        moduleName: "pages/placement/placement-page",
        transition: { name: "slide" },
        context: {
            chosenPhotoPath: page.bindingContext.chosenPhotoPath,
            chosenBackground: page.bindingContext.chosenBackground,
            faceDimensions: {
                x: model.faceX,
                y: model.faceY,
                width: model.faceWidth,
                height: model.faceHeight,
                rotation: model.faceRotation,
            },
        },
    });
}
