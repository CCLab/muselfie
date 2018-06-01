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

export function navigatedTo(args: NavigatedData) {
    const view = args.object as View;
    const imageView = view.page.getViewById("gallery") as View;
    const imageSize = imageView.getActualSize();
    const model = view.page.bindingContext as BackgroundGalleryModel;
    model.set("imageSize", imageSize);
    model.set("thumbnailHeight", imageSize.height / 2); // keep the aspect ratio
    view.bindingContext = model;
}

export function downloadGallery(args: EventData){
    const icon = args.object as View;
    const page = icon.page as Page;
    const model = page.bindingContext as BackgroundGalleryModel;

    page.showModal(
        "pages/background-gallery/background-gallery-download-page",
        {
            'imageSize': model.imageSize,
        },
        ()=>{},
        true,
    );
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
