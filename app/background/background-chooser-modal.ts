import { BackgroundChooserModel } from "./background-chooser-model";
import { ShownModallyData, Page  } from "tns-core-modules/ui/page";
import {EventData} from "tns-core-modules/data/observable";
import {View} from "tns-core-modules/ui/core/view";

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
