import { BackgroundDownloadModel } from "./background-gallery-download-model";
import { ShownModallyData, Page } from "ui/page";
import { EventData } from "data/observable";
import { View } from "ui/core/view";

let closeCallback: Function;

export function onShownModally(args: ShownModallyData) {
    const page = args.object as Page;
    const model = new BackgroundDownloadModel();
    model.set("thumbnailHeight", args.context.imageSize.height / 2); // keep the aspect ratio
    page.bindingContext = model;
    closeCallback = args.closeCallback;
}

export function backTap(args: EventData) {
    closeCallback();
}

export function imageTap(args: EventData) {
    const image = args.object as View;
    const chosenImage = image.bindingContext;
    const page = image.page as Page;
    const model = page.bindingContext as BackgroundDownloadModel;
    model.set("chosenImage", chosenImage.path);
}

export function downloadImage(args: EventData) {
    closeCallback();
}
