import { Observable } from "data/observable";

export class PhotoModel extends Observable {
    public chosenImageSource = "";

    constructor() {
        super();
    }
}
