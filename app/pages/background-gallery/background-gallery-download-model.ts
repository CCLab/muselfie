import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { layout } from "tns-core-modules/utils/utils";
import * as fs from "tns-core-modules/file-system";
import * as http from "http";

/**
 * This interface mirrors the way backgrounds are return by the REST API
 */
export interface RemoteBackgroundEntry {
    id: number;
    name: string;
    image_url: string;
    thumbnail_url: string;
}

export class BackgroundDownloadModel extends Observable {
    public static API_URL = 'https://muselfie-backend.test.laboratorium.ee';
    public remoteBackgrounds = new ObservableArray<RemoteBackgroundEntry>();
    public thumbnailHeight = 250;
    public imageSize;
    public chosenRemoteBackground: RemoteBackgroundEntry;
    public busy = true; // show the loading indicator

    constructor() {
        super();
    }

    public downloadImageList(width: number, height: number) {
        let widthPx = layout.toDevicePixels(width);
        let heightPx = layout.toDevicePixels(height);
        return http.getJSON(
            `${BackgroundDownloadModel.API_URL}/api/backgrounds/?required_height=${heightPx}&required_width=${widthPx}`,
        ).then((apiBackgrounds: RemoteBackgroundEntry) => {
            if (!(apiBackgrounds instanceof Array)) {
                // Wrong format. Reject.
                return Promise.reject("Wrong format of JSON response.");
            }

            // Make the urls absolute
            apiBackgrounds.forEach(background => {
                background.image_url = BackgroundDownloadModel.API_URL + background.image_url;
                background.thumbnail_url = BackgroundDownloadModel.API_URL + background.thumbnail_url;
            });

            this.remoteBackgrounds.push(apiBackgrounds);
            this.set("busy", false); // hide the loading indicator
        });
    }
}
