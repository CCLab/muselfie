import { Observable } from "data/observable";

export class BackgroundModel extends Observable {
    public chosenBackground;
    public chosenPhotoPath = "";

    constructor() {
        super();
    }
}
