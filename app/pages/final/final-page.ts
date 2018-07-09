import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import * as app from "application";
import { confirm } from "ui/dialogs";
import * as fs from "file-system";
import { EventData } from "data/observable";

import * as SocialShare from "nativescript-social-share";
import { SnackBar } from "nativescript-snackbar";
import * as permissions from "nativescript-permissions";

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
                moduleName: "pages/background-gallery/background-gallery-page",
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

declare var android;
declare var java;
/**
 * Send out system information about new image, so it can immediately show up in the gallery.
 */
function broadcastNewImage(path: string) {
    const intent = new android.content.Intent(android.content.Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
    intent.setData(android.net.Uri.fromFile(new java.io.File(path)));
    app.android.foregroundActivity.sendBroadcast(intent);
}

export function saveTap(args: EventData) {
    const button = args.object as View;
    const page = button.page as Page;
    const model = page.bindingContext as FinalModel;

    permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE).then(() => {
        const galleryPath = android.os.Environment.getExternalStoragePublicDirectory(
            android.os.Environment.DIRECTORY_DCIM,
        ).toString();
        const imagePath = fs.path.join(galleryPath, `muselfie_${new Date().getTime()}.jpg`);
        if (!fs.File.exists(imagePath)) {
            let saved = model.finalImageSource.saveToFile(imagePath, "jpg");
            let snackbar = new SnackBar();
            if (saved) {
                broadcastNewImage(imagePath);
                snackbar.action({
                    actionText: "ok",
                    snackText: "Kolaż zapisany do galerii!",
                    hideDelay: 3500,
                  });
            } else {
                snackbar.action({
                    actionText: "ok",
                    snackText: "Nie udało się zapisać kolażu :(",
                    hideDelay: 3500,
                  });
            }
        }
    });
}
