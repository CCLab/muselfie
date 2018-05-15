import { BackgroundChooserModel } from "./background-chooser-model";
import { ShownModallyData, Page  } from "ui/page";
import { EventData } from "data/observable";
import { View } from "ui/core/view";

// tslint:disable-next-line:ban-types
let closeCallback: Function;
export function onShownModally(args: ShownModallyData) {
    const page = args.object as Page;
    const model = new BackgroundChooserModel();
    model.set("thumbnailHeight", args.context.imageSize.height / 2); // keep the aspect ratio
    page.bindingContext = model;
    closeCallback = args.closeCallback;
}

export function imageTap(args: EventData) {
    const view = args.object as View;
    const model = view.page.bindingContext as BackgroundChooserModel;
    const chosenFile = view.bindingContext;
    model.set("chosenFile", chosenFile);
}

export function nextTap(args: EventData) {
    const view = args.object as View;
    const model = view.bindingContext;
    closeCallback(model.chosenFile);
}
