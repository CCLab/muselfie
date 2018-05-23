import * as frameModule from "ui/frame";
import { NavigatedData, Page } from "ui/page";
import { View } from "ui/core/view";
import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    page.bindingContext = new HomeViewModel();
}

export function startTap(args: NavigatedData) {
    frameModule.topmost().navigate({
        moduleName: "pages/background-gallery/background-gallery-page",
        transition: { name: "slide" },
    });
}
