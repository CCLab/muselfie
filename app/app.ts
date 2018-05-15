import * as app from "application";
import * as fresco from "nativescript-fresco";
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
import "./bundle-config";

if (app.android) {
    app.on("launch", () => {
        fresco.initialize();
    });
}

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  'mdi': 'material-design-icons.css'
};

TNSFontIcon.loadCss();

const resources = app.getResources();
resources['fonticon'] = fonticon;
app.setResources(resources);

app.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
