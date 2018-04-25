import { Observable } from "data/observable";
import { screen } from "platform";

export class PlacementModel extends Observable {
    public chosenPhotoPath = "";
    public chosenBackgroundPath = "";

    public placementX: number;
    public placementY: number;
    public placementRadiusX: number;
    public placementRadiusY: number;

    private commitedPlacementRadiusX: number;
    private commitedplacementRadiusY: number;
    private commitedPlacementX: number;
    private commitedPlacementY: number;

    constructor() {
        super();
        this.placementRadiusX = screen.mainScreen.widthDIPs * 0.2;
        this.placementRadiusY = screen.mainScreen.widthDIPs * 0.3;
        this.commitedPlacementRadiusX = this.placementRadiusX;
        this.commitedplacementRadiusY = this.placementRadiusY;
        this.placementX = screen.mainScreen.widthDIPs * 0.5;
        this.placementY = screen.mainScreen.heightDIPs * 0.5 - (this.placementRadiusY / 2);
        this.commitedPlacementX = this.placementX;
        this.commitedPlacementY = this.placementY;
    }

    public movePlacementPosition(x: number, y: number) {
        this.set("placementX", this.commitedPlacementX + x);
        this.set("placementY", this.commitedPlacementY + y);
    }

    public scalePlacementSize(factor: number) {
        this.set("placementRadiusX", this.commitedPlacementRadiusX * factor);
        this.set("placementRadiusY", this.commitedplacementRadiusY * factor);
    }

    public setPlacementPosition(x: number, y: number) {
        this.set("placementX", x);
        this.set("placementY", y);
    }

    public commitPlacementChanges() {
        this.set("commitedPlacementRadiusX", this.placementRadiusX);
        this.set("commitedplacementRadiusY", this.placementRadiusY);
        this.set("commitedPlacementX", this.placementX);
        this.set("commitedPlacementY", this.placementY);
    }
}
