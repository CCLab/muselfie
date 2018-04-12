if ((global as any).TNS_WEBPACK) {
    // registers tns-core-modules UI framework modules
    require("bundle-entry-points");

    // register application modules
    // This will register each `page` postfixed xml, css, js, ts, scss etc. in the app/ folder
    const context = require.context("~/", true, /(page|fragment|modal)\.(xml|css|js|ts|scss)$/);
    global.registerWebpackModules(context);
    global.registerModule("nativescript-fresco", () => require("nativescript-fresco"));
    global.registerModule("nativescript-ui-listview", () => require("nativescript-ui-listview"));

}
