import { Observable } from "data/observable";

export class HomeViewModel extends Observable {
    public appInfoVisibility: boolean = false;
    
    constructor() {
        super();
    }
}
