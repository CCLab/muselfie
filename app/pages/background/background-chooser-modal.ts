import { BackgroundChooserModel } from "./background-chooser-model";
import { ShownModallyData, Page  } from "ui/page";
import { EventData } from "data/observable";
import { View } from "ui/core/view";

// tslint:disable-next-line:ban-types
let closeCallback: Function;
export function onShownModally(args: ShownModallyData) {
    const page = args.object as Page;
    closeCallback = args.closeCallback;
    page.bindingContext = new BackgroundChooserModel();
}

export function imageTap(args: EventData) {
    const view = args.object as View;
    const chosenFile = view.bindingContext;
    closeCallback(chosenFile);
}
