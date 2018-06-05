import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { layout } from "tns-core-modules/utils/utils";
import * as fs from "tns-core-modules/file-system";
import * as lowdb from "lowdb";
import * as NativeScriptAdapter from "lowdb-nativescript-adapter";

export type backgroundEntryType = "external"|"internal";
export interface BackgroundEntry {
    path: string;
    thumbnailPath: string;
    name: string;
    type: backgroundEntryType;
    remoteId?: number;
}

export class BackgroundGalleryModel extends Observable {
    public backgrounds = new ObservableArray<BackgroundEntry>();
    public imageSize;
    public thumbnailHeight = 250;
    public chosenBackground: BackgroundEntry;
    public db: lowdb.LowdbSync<lowdb.AdapterSync>;

    constructor() {
        super();

        const adapter = new NativeScriptAdapter("backgrounds.json");
        this.db = lowdb<lowdb.AdapterSync>(adapter);
    }

    /**
     * Gets the directory where the backgrounds that come with the application are stored.
     * The value depends on `desiredWidthPx` and `desiredHeightPx` (as the method chooses a version
     * best suited for the size). Expect the resized files to be in folders
     * named using a `automatically-resized/[width]x[height]` format.
     */
    public static getStaticBackgroundsDir(desiredWidthPx, desiredHeightPx): fs.Folder {
        const backgroundsFolder = fs.knownFolders.currentApp().getFolder("content/backgrounds");
        const resizedFolder = backgroundsFolder.getFolder("automatically-resized");

        // I need to do the weird type casting below because there is a bug in NativeScript definition
        // of getEntitiesSync() returned type, so I have to force the correct type.
        const resizeDirs = resizedFolder.getEntitiesSync() as any as fs.FileSystemEntity[];

        // Find the best image version for this screen
        let bestWidth: number;
        let bestHeight: number;
        for (let dir of resizeDirs) {
            let size = dir.name.split("x");
            if (size.length !== 2 || isNaN(+size[0]) || isNaN(+size[1])) {
                // The file's name is not in the [width]x[height] format, skip
                continue;
            }
            let currentWidth = +size[0];
            let currentHeight = +size[1];

            let firstIteration = (bestWidth === undefined || bestHeight === undefined);
            let fitsBoundries = (currentWidth >= desiredWidthPx && currentHeight >= desiredHeightPx);
            let smallerThanBest = !firstIteration && (currentWidth < bestWidth || currentHeight < bestHeight);

            if (fitsBoundries && (firstIteration || smallerThanBest)) {
                bestWidth = currentWidth;
                bestHeight = currentHeight;
            }
        }

        if (bestWidth && bestHeight) {
            return resizedFolder.getFolder(bestWidth + "x" + bestHeight);
        } else {
            return backgroundsFolder;
        }
    }

    public showImages() {
        let backgroundsFromDb = this.db.get("backgrounds").value() as BackgroundEntry[];
        if (backgroundsFromDb) {
            this.backgrounds.push(backgroundsFromDb);
        } else {
            // No background in database; get the default list of backgrounds
            const backgroundsFolder = fs.knownFolders.currentApp().getFolder("content/backgrounds");
            let defaultBackgrounds = JSON.parse(backgroundsFolder.getFile("list.json").readTextSync());
            let backgroundsDir = BackgroundGalleryModel.getStaticBackgroundsDir(
                layout.toDevicePixels(this.imageSize.width),
                layout.toDevicePixels(this.imageSize.height),
            );
            let thumbnailsDir = BackgroundGalleryModel.getStaticBackgroundsDir(
                layout.toDevicePixels(this.imageSize.width * 0.5),
                layout.toDevicePixels(this.imageSize.height * 0.5),
            );

            for (let background of defaultBackgrounds) {
                this.backgrounds.push({
                    path: backgroundsDir.getFile(background.file).path,
                    thumbnailPath: thumbnailsDir.getFile(background.file).path,
                    name: background.name,
                    type: "internal",
                });
            }

            // save to db
            this.db.set("backgrounds", (this.backgrounds as any)._array).write();
        }
    }

    /**
     * Adds new background entry to the beginning of the background lists
     * (both in the database and the model itself).
     */
    public addBackgroundEntry(backgroundEntry: BackgroundEntry) {
        this.db.get("backgrounds").unshift(backgroundEntry).write();
        this.backgrounds.unshift(backgroundEntry);
        this.set("chosenBackground", backgroundEntry);
    }

    /**
     * Get a list of remote ids of all downloaded backgrounds.
     */
    public getBackgroundRemoteIds(): number[] {
        return this.db.get("backgrounds").map("remoteId").compact().value();
    }
}
