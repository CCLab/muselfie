import { Observable } from "data/observable";
import { screen } from "platform";

export class FaceModel extends Observable {
    public chosenPhotoPath = "";
    public chosenBackground;

    public faceX: number;
    public faceY: number;
    public faceWidth: number;
    public faceHeight: number;
    public faceRotation: number;

    private commitedFaceWidth: number;
    private commitedFaceHeight: number;
    private commitedFaceX: number;
    private commitedFaceY: number;
    private commitedFaceRotation: number;


    constructor() {
        super();
        this.faceWidth = screen.mainScreen.widthDIPs * 0.4;
        this.faceHeight = screen.mainScreen.widthDIPs * 0.6;
        this.commitedFaceWidth = this.faceWidth;
        this.commitedFaceHeight = this.faceHeight;
        this.faceX = screen.mainScreen.widthDIPs * 0.3;
        this.faceY = screen.mainScreen.heightDIPs * 0.3 - (this.faceHeight / 2);
        this.commitedFaceX = this.faceX;
        this.commitedFaceY = this.faceY;
        this.commitedFaceRotation = 0;
        this.faceRotation = this.commitedFaceRotation;
    }

    public moveFacePosition(x: number, y: number) {
        this.set("faceX", this.commitedFaceX + x);
        this.set("faceY", this.commitedFaceY + y);
    }

    public scaleFaceSize(factor: number) {
        this.set("faceWidth", this.commitedFaceWidth * factor);
        this.set("faceHeight", this.commitedFaceHeight * factor);
    }

    public setFacePosition(x: number, y: number) {
        this.set("faceX", x);
        this.set("faceY", y);
    }

    public setFaceRotation(deg: number){
        this.set("faceRotation", this.commitedFaceRotation + deg);
    }

    public commitFaceChanges() {
        this.set("commitedFaceWidth", this.faceWidth);
        this.set("commitedFaceHeight", this.faceHeight);
        this.set("commitedFaceX", this.faceX);
        this.set("commitedFaceY", this.faceY);
        this.set("commitedFaceRotation", this.faceRotation);  
    }
}
