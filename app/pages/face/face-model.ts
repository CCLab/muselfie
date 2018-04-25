import { Observable } from "data/observable";
import { screen } from "platform";

export class FaceModel extends Observable {
    public chosenPhotoPath = "";
    public chosenBackgroundPath = "";

    public faceX: number;
    public faceY: number;
    public faceRadiusX: number;
    public faceRadiusY: number;

    private commitedFaceRadiusX: number;
    private commitedfaceRadiusY: number;
    private commitedFaceX: number;
    private commitedFaceY: number;

    constructor() {
        super();
        this.faceRadiusX = screen.mainScreen.widthDIPs * 0.2;
        this.faceRadiusY = screen.mainScreen.widthDIPs * 0.3;
        this.commitedFaceRadiusX = this.faceRadiusX;
        this.commitedfaceRadiusY = this.faceRadiusY;
        this.faceX = screen.mainScreen.widthDIPs * 0.5;
        this.faceY = screen.mainScreen.heightDIPs * 0.5 - (this.faceRadiusY / 2);
        this.commitedFaceX = this.faceX;
        this.commitedFaceY = this.faceY;
    }

    public moveFacePosition(x: number, y: number) {
        this.set("faceX", this.commitedFaceX + x);
        this.set("faceY", this.commitedFaceY + y);
    }

    public scaleFaceSize(factor: number) {
        this.set("faceRadiusX", this.commitedFaceRadiusX * factor);
        this.set("faceRadiusY", this.commitedfaceRadiusY * factor);
    }

    public setFacePosition(x: number, y: number) {
        this.set("faceX", x);
        this.set("faceY", y);
    }

    public commitFaceChanges() {
        this.set("commitedFaceRadiusX", this.faceRadiusX);
        this.set("commitedfaceRadiusY", this.faceRadiusY);
        this.set("commitedFaceX", this.faceX);
        this.set("commitedFaceY", this.faceY);
    }
}
