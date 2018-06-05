import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { Image } from "tns-core-modules/ui/image";
import { confirm } from "ui/dialogs";

import * as SocialShare from "nativescript-social-share";

import { FinalModel } from "./final-model";
import {View} from "tns-core-modules/ui/core/view";


export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new FinalModel();
    }

    page.bindingContext.set("chosenBackground", page.navigationContext.chosenBackground);
    page.bindingContext.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
    page.bindingContext.set("faceDimensions", page.navigationContext.faceDimensions);
    page.bindingContext.set("placementDimensions", page.navigationContext.placementDimensions);
}


export function navigatedTo(args: NavigatedData) {
    const page = args.object as Page;
    const imageView = page.getViewById("image-final") as Image;
    const imageSize = imageView.getActualSize();
    const model = page.bindingContext as FinalModel;

    model.setFinalImage(imageSize);
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}


export function homeTap(args: NavigatedData) {
    confirm({
        message: "Tworzenie nowego kolażu skasuje dotychczasowy. Czy chcesz kontynuować?",
        neutralButtonText: "Anuluj",
        okButtonText: "Zacznij od nowa",
    }).then(result => {
        if (result) {
            frameModule.topmost().navigate({
                moduleName: "pages/home/home-page",
                clearHistory: true,
            });
        }
    });

}


export function shareTap(args: NavigatedData) {
    const button = args.object as View;
    const page = button.page as Page;
    const model = page.bindingContext as FinalModel;

    SocialShare.shareImage(model.finalImageSource, "Gdzie chcesz udostępnić swój kolaż?");
}
