import { Observable } from "data/observable";

export class BackgroundModel extends Observable {
    public chosenPhotoPath = "";

    constructor() {
        super();
    }
}
