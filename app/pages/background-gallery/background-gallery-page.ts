import * as frameModule from "tns-core-modules/ui/frame";
import { screen } from "tns-core-modules/platform/platform";
import { BackgroundGalleryModel } from "./background-gallery-model";
import { NavigatedData, Page  } from "ui/page";
import { EventData } from "data/observable";
import { View } from "ui/core/view";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    const model = new BackgroundGalleryModel();
    page.bindingContext = model;
}

export function onLoaded(args: EventData) {
    const view = args.object as View;
    const model = view.page.bindingContext as BackgroundGalleryModel;
    model.set("imageSize", screen.mainScreen.heightDIPs - 94); //count the remaining screensize, while 94 is the height of the ActionBar
    model.set("thumbnailHeight",model.imageSize / 2); // keep the aspect ratio
    view.bindingContext = model;
}



export function imageTap(args: EventData) {
    const view = args.object as View;
    const model = view.page.bindingContext as BackgroundGalleryModel;
    const chosenFile = view.bindingContext;
    model.set("chosenFile", chosenFile);
    model.set("chosenBackgroundPath", chosenFile.path);
}

export function nextTap(args: NavigatedData) {
    const button = args.object as View;
    const page = button.page as Page;
    const model = page.bindingContext as BackgroundGalleryModel;
    frameModule.topmost().navigate({
        moduleName: "pages/background/background-page",
        transition: { name: "slide" },
        context: {
            chosenBackgroundPath: page.bindingContext.chosenBackgroundPath,
        },
    });
}
