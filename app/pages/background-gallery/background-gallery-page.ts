import * as frameModule from "tns-core-modules/ui/frame";
import { BackgroundGalleryModel, BackgroundEntry } from "./background-gallery-model";
import { NavigatedData, Page  } from "ui/page";
import { EventData } from "data/observable";
import { View } from "ui/core/view";
import { RadListView } from "nativescript-ui-listview";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    page.bindingContext = new BackgroundGalleryModel();
}

export function navigatedTo(args: NavigatedData): void {
    const view = args.object as View;
    const imageView = view.page.getViewById("gallery") as View;
    const imageSize = imageView.getActualSize();
    const model = view.page.bindingContext as BackgroundGalleryModel;
    model.set("imageSize", imageSize);
    model.set("thumbnailHeight", imageSize.height / 2); // keep the aspect ratio
    model.showImages();
}

export function downloadGallery(args: EventData) {
    const icon = args.object as View;
    const page = icon.page as Page;
    const model = page.bindingContext as BackgroundGalleryModel;
    const galleryView = page.getViewById("gallery") as RadListView;

    page.showModal(
        "pages/background-gallery/background-gallery-download-page",
        {
            imageSize: model.imageSize,
        },
        (backgroundEntry: BackgroundEntry) => {
            if (backgroundEntry) {
                model.addBackgroundEntry(backgroundEntry);
                galleryView.scrollToIndex(0);
            }
        },
        true,
    );
}

export function imageTap(args: EventData) {
    const view = args.object as View;
    const model = view.page.bindingContext as BackgroundGalleryModel;
    const chosenBackground = view.bindingContext;
    model.set("chosenBackground", chosenBackground);
}

export function nextTap(args: NavigatedData) {
    const button = args.object as View;
    const page = button.page as Page;
    frameModule.topmost().navigate({
        moduleName: "pages/background/background-page",
        transition: { name: "slide" },
        context: {
            chosenBackground: page.bindingContext.chosenBackground,
        },
    });
}
