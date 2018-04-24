import { Observable } from "data/observable";
import { FileSystemEntity } from "tns-core-modules/file-system";

export class BackgroundModel extends Observable {
    public chosenBackgroundPath = "";

    constructor() {
        super();
    }

    public backgroundChosen(image: FileSystemEntity) {
        if (image) {
            this.set("chosenBackgroundPath", image.path);
        }
    }
}
