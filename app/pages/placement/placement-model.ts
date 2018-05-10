import { Observable } from "data/observable";
import { screen } from "platform";

export class PlacementModel extends Observable {
    public chosenPhotoPath = "";
    public chosenBackgroundPath = "";

    public placementX: number;
    public placementY: number;
    public placementWidth: number;
    public placementHeight: number;
  
    private commitedPlacementWidth: number;
    private commitedPlacementHeight: number;
    private commitedPlacementX: number;
    private commitedPlacementY: number;
  
    constructor() {
        super();
        this.placementWidth = screen.mainScreen.widthDIPs * 0.4;
        this.placementHeight = screen.mainScreen.widthDIPs * 0.6;
        this.commitedPlacementWidth = this.placementWidth;
        this.commitedPlacementHeight = this.placementHeight;
        this.placementX = screen.mainScreen.widthDIPs * 0.3;
        this.placementY = screen.mainScreen.heightDIPs * 0.3 - (this.placementHeight / 2);
        this.commitedPlacementX = this.placementX;
        this.commitedPlacementY = this.placementY;    
    }

    public movePlacementPosition(x: number, y: number) {
        this.set("placementX", this.commitedPlacementX + x);
        this.set("placementY", this.commitedPlacementY + y);
    }

    public scalePlacementSize(factor: number) {
        this.set("placementWidth", this.commitedPlacementWidth * factor);
        this.set("placementHeight", this.commitedPlacementHeight * factor);
    }

    public setPlacementPosition(x: number, y: number) {
        this.set("placementX", x);
        this.set("placementY", y);
    }
  
    public commitPlacementChanges() {
        this.set("commitedPlacementWidth", this.placementWidth);
        this.set("commitedplacementHeight", this.placementHeight);
        this.set("commitedPlacementX", this.placementX);
        this.set("commitedPlacementY", this.placementY);     
    }
}
