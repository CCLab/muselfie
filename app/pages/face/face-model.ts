import { Observable } from "data/observable";
import { screen } from "platform";

export class FaceModel extends Observable {
    public chosenImage = "";
    public faceX: number;
    public faceY: number;
    public faceWidth: number;
    public faceHeight: number;
    private commitedFaceWidth: number;
    private commitedfaceHeight: number;
    private commitedFaceX: number;
    private commitedFaceY: number;

    constructor() {
        super();
        this.faceWidth = screen.mainScreen.widthDIPs * 0.2;
        this.faceHeight = screen.mainScreen.widthDIPs * 0.3;
        this.commitedFaceWidth = this.faceWidth;
        this.commitedfaceHeight = this.faceHeight;
        this.faceX = screen.mainScreen.widthDIPs * 0.5;
        this.faceY = screen.mainScreen.heightDIPs * 0.5 - (this.faceHeight / 2);
        this.commitedFaceX = this.faceX;
        this.commitedFaceY = this.faceY;
    }

    public moveFacePosition(x: number, y: number) {
        this.set("faceX", this.commitedFaceX + x);
        this.set("faceY", this.commitedFaceY + y);
    }

    public scaleFaceSize(factor: number) {
        this.set("faceWidth", this.commitedFaceWidth * factor);
        this.set("faceHeight", this.commitedfaceHeight * factor);
    }

    public setFacePosition(x: number, y: number) {
        this.set("faceX", x);
        this.set("faceY", y);
    }
    
    public commitFaceChanges() {
        this.set("commitedFaceWidth", this.faceWidth);
        this.set("commitedfaceHeight", this.faceHeight);
        this.set("commitedFaceX", this.faceX);
        this.set("commitedFaceY", this.faceY);
    }
}
