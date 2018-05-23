import { Observable } from "data/observable";
import { FileSystemEntity } from "tns-core-modules/file-system";

export class BackgroundModel extends Observable {
    public chosenBackgroundPath = "";
    public chosenPhotoPath = "";

    constructor() {
        super();
    }
}
