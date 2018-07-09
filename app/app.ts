import * as app from "application";
import * as fresco from "nativescript-fresco";

import { polishLineBreaks } from "~/utils/display";

if (app.android) {
    app.on("launch", () => {
        fresco.initialize();
    });
}

app.getResources().polishLineBreaks = polishLineBreaks;
app.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
