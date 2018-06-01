import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as fs from "tns-core-modules/file-system";
import { Image } from "tns-core-modules/ui/image/image";
import { FileSystemEntity } from "tns-core-modules/file-system";

export class BackgroundDownloadModel extends Observable {
    public images = new ObservableArray<fs.FileSystemEntity>();
    public thumbnailHeight = 250;
    public imageSize;
    public chosenImage: fs.FileSystemEntity;

    constructor() {
        super();
        const backgroundsFolder = fs.knownFolders.currentApp().getFolder("content/backgrounds");
        backgroundsFolder.getEntities().then(this.getImageList.bind(this));
        this.chosenImage;
    }

    public getImageList(files: fs.FileSystemEntity[]) {
        const images = files.filter(file => file.name.endsWith("jpg"));
        this.images.push(images);
    }
}
