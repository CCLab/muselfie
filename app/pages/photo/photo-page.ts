import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { EventData } from "tns-core-modules/data/observable";

import * as imagepicker from "nativescript-imagepicker";

import { PhotoModel } from "./photo-model";
import {View} from "tns-core-modules/ui/core/view";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new PhotoModel();
    }
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}

export function chooseTap(args: EventData) {
    const button = args.object as View;
    const page = button.page as Page;
    let context = imagepicker.create({
        mode: "single",
    });
    context
    .authorize()
    .then(() => {
        return context.present();
    })
    .then((selection) => {
        selection.forEach((selected) => {
            console.log(selected.uri);
            console.log(selected.fileUri);
            console.log(selected.thumb);
            page.bindingContext.chosenImageSource = selected.uri;
            selected.getImage({ maxWidth: 200, maxHeight: 200 })
            .then((imageSource) => {
                // page.bindingContext.chosenImageSource = imageSource;
            });
        });
    });
}

export function nextTap(args: NavigatedData) {
    frameModule.topmost().navigate({
        moduleName: "pages/photo/photo-page",
        transition: { name: "slide" },
    });
}
