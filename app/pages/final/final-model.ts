import { Observable } from "data/observable";

export class FinalModel extends Observable {
    public chosenPhotoPath = "";
    public chosenBackgroundPath = "";
    public finalImagePath = "";

    constructor() {
        super();
    }
}
