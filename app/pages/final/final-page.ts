import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { Image } from "tns-core-modules/ui/image";
import { confirm } from "ui/dialogs";

import * as SocialShare from "nativescript-social-share";

import { FinalModel } from "./final-model";
import {View} from "tns-core-modules/ui/core/view";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    let model = page.bindingContext as FinalModel;

    if (!model) {
        model = page.bindingContext = new FinalModel();
    }

    model.set("chosenBackground", page.navigationContext.chosenBackground);
    model.set("chosenPhotoPath", page.navigationContext.chosenPhotoPath);
    model.set("faceDimensions", page.navigationContext.faceDimensions);
    model.set("placementDimensions", page.navigationContext.placementDimensions);
    model.set("imageSize", page.navigationContext.imageSize);

    model.setFinalImage();
}

export function navigatedFrom(args: NavigatedData) {
    const page = args.object as Page;
    const model = page.bindingContext as FinalModel;

    // free the final image from memory
    if (model.finalImageSource && model.finalImageSource.android) {
        model.finalImageSource.android.recycle();
    }
}

export function backTap() {
    frameModule.topmost().goBack();
}

export function homeTap() {
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
