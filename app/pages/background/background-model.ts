import { Observable } from "data/observable";
import { FileSystemEntity } from "tns-core-modules/file-system";

export class BackgroundModel extends Observable {
    public chosenBackground;
    public chosenPhotoPath = "";

    constructor() {
        super();
    }
}
