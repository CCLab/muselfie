import * as frameModule from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "ui/page";
import { View } from "ui/core/view";
import { EventData } from "tns-core-modules/data/observable";

import { BackgroundModel } from "./background-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;

    if (!page.bindingContext) {
        page.bindingContext = new BackgroundModel();
    }
}

export function backTap(args: NavigatedData) {
    frameModule.topmost().goBack();
}

export function chooseTap(args: EventData) {
    const button = args.object as View;
    const page = button.page as Page;
    page.showModal(
        "background/background-chooser-modal",
        {},
        page.bindingContext.imageChosen.bind(page.bindingContext),
        true,
    );
}
