import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { PanGestureEventData, TouchGestureEventData, PinchGestureEventData,
    GestureStateTypes, RotationGestureEventData } from "ui/gestures";
import { View } from "tns-core-modules/ui/core/view";
import { PlacementModel } from "./placement-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    let model = page.bindingContext as PlacementModel;

    if (!model) {
        model = page.bindingContext = new PlacementModel();
    }

    model.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
    model.set("faceDimensions", page.navigationContext.faceDimensions);
    model.set("chosenBackground", page.navigationContext.chosenBackground);
    model.set("imageSize", page.navigationContext.imageSize);

    model.setFaceImage();
}

export function backTap() {
    frameModule.topmost().goBack();
}

let multiFingerMode = false;
export function placementTouch(args: TouchGestureEventData) {
    const model = (args.object as View).bindingContext as PlacementModel;

    if (args.action === "down") {
        multiFingerMode = (args.getPointerCount() !== 1);
    } else if (args.action === "up") {
        model.commitPlacementChanges();
    }
}

export function placementPinch(args: PinchGestureEventData) {
    const model = (args.object as View).bindingContext as PlacementModel;
    if (args.state === GestureStateTypes.changed) {
        model.scalePlacementSize(args.scale);
        model.setPlacementPosition(
            args.getFocusX() - model.placementWidth / 2,
            args.getFocusY() - model.placementHeight / 2,
        );
    }
}

export function placementPan(args: PanGestureEventData) {
    const model = (args.object as View).bindingContext as PlacementModel;
    if (!multiFingerMode && args.state === GestureStateTypes.changed) {
        model.movePlacementPosition(args.deltaX, args.deltaY);
    }
}

export function placementRotation(args: RotationGestureEventData) {
    const model = (args.object as View).bindingContext as PlacementModel;
    model.setPlacementRotation(args.rotation);
}

export function nextTap(args: NavigatedData) {
    const button = args.object as View;
    const page = button.page as Page;
    const model = page.bindingContext as PlacementModel;

    frameModule.topmost().navigate({
        moduleName: "pages/final/final-page",
        transition: { name: "slide" },
        context: {
            chosenPhotoPath: model.chosenPhotoPath,
            chosenBackground: model.chosenBackground,
            placementDimensions: {
                x: model.placementX,
                y: model.placementY,
                width: model.placementWidth,
                height: model.placementHeight,
                rotation: model.placementRotation,
            },
            faceDimensions: model.faceDimensions,
            imageSize: model.imageSize,
        },
    });
}
