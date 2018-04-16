import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { EventData } from "tns-core-modules/data/observable";
import * as imageSource from "image-source";
import * as fs from "file-system";

import * as imagepicker from "nativescript-imagepicker";
import * as fresco from "nativescript-fresco";

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
            imageSource.fromAsset(selected).then((image) => {
                let folder = fs.knownFolders.temp();
                let fileName = `_chosen_image.jpg`;
                let path = fs.path.join(folder.path, fileName);

                image.saveToFile(path, "jpg");
                fresco.getImagePipeline().evictFromCache(`file:${path}`);
                page.bindingContext.set("chosenImage", path);
            }).catch((reason) => {
                console.error(reason);
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
