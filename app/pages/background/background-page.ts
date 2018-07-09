import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { TouchGestureEventData } from "ui/gestures";
import { View } from "ui/core/view";
import { EventData } from "tns-core-modules/data/observable";

import * as imagepicker from "nativescript-imagepicker";
import * as imageSource from "image-source";
import * as fs from "file-system";
import * as app from "application";
import * as fresco from "nativescript-fresco";
import { BackgroundModel } from "./background-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    let model = page.bindingContext as BackgroundModel;

    if (!model) {
        model = page.bindingContext = new BackgroundModel();
    }

    model.set("chosenBackground", page.navigationContext.chosenBackground);
}

export function backTap() {
    frameModule.topmost().goBack();
}

export function toggleInfo(args: TouchGestureEventData){
    if (args.action === "down") {
        const page = (args.object as View).page as Page;
        let model = page.bindingContext as BackgroundModel;
        const pictureInfoWrapper = page.getViewById('picture-info-wrapper') as View;
        const pictureInfo = page.getViewById('picture-info') as View;
        const pictureeInfoHeight = pictureInfo.getActualSize().height;

        if (model.infoVisibilty) {
            pictureInfoWrapper.className = 'picture-icon-wrapper slide-up';
            pictureInfoWrapper.animate({ translate: { x: 0, y: -1 * pictureeInfoHeight }, duration: 400 });

        } else {
            pictureInfoWrapper.className = 'picture-icon-wrapper slide-down';
            pictureInfoWrapper.animate({ translate: { x: 0, y: 0 }, duration: 400 });
        }
        model.set("infoVisibilty", !model.infoVisibilty);
    }
}

declare var org;

export function choosePhoto(args: EventData) {
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
                page.bindingContext.set("chosenPhotoPath", path);

                // clear background-image cache (for the Label on the next screen)
                let fetcher = org.nativescript.widgets.image.Fetcher.getInstance(app.android.context);
                fetcher.clearCache();
                frameModule.topmost().navigate({
                    moduleName: "pages/face/face-page",
                    transition: { name: "slide" },
                    context: {
                        chosenPhotoPath: page.bindingContext.chosenPhotoPath,
                        chosenBackground: page.navigationContext.chosenBackground,
                        imageSize: page.navigationContext.imageSize,
                    },
                });
            }).catch((reason) => {
                console.error(reason);
            });
        });
    });
}
