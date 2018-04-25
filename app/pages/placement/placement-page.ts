import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { PanGestureEventData, TouchGestureEventData, PinchGestureEventData, GestureStateTypes } from "ui/gestures";
import { View } from "tns-core-modules/ui/core/view";


import { PlacementModel } from "./placement-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new PlacementModel();
    }

    page.bindingContext.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
    page.bindingContext.set("chosenBackgroundPath", page.navigationContext.chosenBackgroundPath);
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}

let multiFingerMode = false;
export function placementTouch(args: TouchGestureEventData) {
    const model = (args.object as View).bindingContext as PlacementModel;

    if (args.action == "down") {
        multiFingerMode = (args.getPointerCount() !== 1);
    } else if (args.action == "up") {
        model.commitPlacementChanges();
    }
}

export function placementPinch(args: PinchGestureEventData) {
    const model = (args.object as View).bindingContext as PlacementModel;
    if (args.state === GestureStateTypes.changed) {
        model.scalePlacementSize(args.scale);
        model.setPlacementPosition(args.getFocusX(), args.getFocusY());
    }
}

export function placementPan(args: PanGestureEventData) {
    const model = (args.object as View).bindingContext as PlacementModel;
    if (!multiFingerMode && args.state === GestureStateTypes.changed) {
        model.movePlacementPosition(args.deltaX, args.deltaY);
    }
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
            chosenBackgroundPath: model.chosenBackgroundPath,
            placementDimensions: {
                x: model.placementX,
                y: model.placementY,
                radiusX: model.placementRadiusX,
                radiusY: model.placementRadiusY,
            },
            faceDimensions: page.navigationContext.faceDimensions,
        },
    });
}
