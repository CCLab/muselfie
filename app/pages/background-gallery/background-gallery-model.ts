import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as fs from "tns-core-modules/file-system";
import { FileSystemEntity } from "tns-core-modules/file-system";

export class BackgroundGalleryModel extends Observable {
    public images = new ObservableArray<fs.FileSystemEntity>();
    public imageSize;
    public thumbnailHeight = 250;
    public chosenFile: fs.FileSystemEntity;
    public chosenBackgroundPath: string;

    constructor() {
        super();
        const backgroundsFolder = fs.knownFolders.currentApp().getFolder("content/backgrounds");
        backgroundsFolder.getEntities().then(this.getImageList.bind(this));
    }

    public getImageList(files: fs.FileSystemEntity[]) {
        const images = files.filter(file => file.name.endsWith("jpg"));
        this.images.push(images);
    }
}
