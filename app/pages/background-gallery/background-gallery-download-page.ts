import { BackgroundDownloadModel } from "./background-gallery-download-model";
import { ShownModallyData, Page } from "ui/page";
import { EventData } from "data/observable";
import { View } from "ui/core/view";
import * as dialogs from "ui/dialogs";

let closeCallback: Function; // tslint:disable-line

export function onShownModally(args: ShownModallyData) {
    const page = args.object as Page;
    const model = new BackgroundDownloadModel();
    const size = args.context.imageSize;
    model.set("thumbnailHeight", size.height / 2); // keep the aspect ratio
    model.set("downloadedRemoteIds", args.context.downloadedRemoteIds);
    page.bindingContext = model;
    closeCallback = args.closeCallback;

    // Get the list of images
    model.downloadImageList(size.width, size.height).catch(() => {
        dialogs.alert("Problem z połączeniem internetowym. Spróbuj ponownie później.").then(() => {
            closeCallback();
        });
    });
}

export function backTap() {
    closeCallback();
}

export function imageTap(args: EventData) {
    const image = args.object as View;
    const page = image.page as Page;
    const model = page.bindingContext as BackgroundDownloadModel;
    model.set("chosenRemoteBackground", image.bindingContext);
}

export function downloadImage(args: EventData) {
    const page = (args.object as View).page as Page;
    const model = page.bindingContext as BackgroundDownloadModel;
    model.downloadChosenBackground().then((backgroundEntry) => {
        closeCallback(backgroundEntry);
    }).catch(() => {
        dialogs.alert("Nie udało się pobrać obrazka. Spróbuj ponownie później.");
    });
}
