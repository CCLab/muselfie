import { Observable } from "data/observable";

export class BackgroundModel extends Observable {
    public chosenPhotoPath = "";
    public infoVisibilty = true;

    constructor() {
        super();
    }
}
