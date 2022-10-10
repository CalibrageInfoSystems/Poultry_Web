import { Injectable, Directive } from '@angular/core';

@Injectable()
export class Conversion {

    constructor() { }

    EggstoBoxes(val){
        val = Math.round(val);
        return  parseFloat((Math.floor(val/210)).toString() + '.'+ (Math.floor(val%210)/30).toString());
    }

    BoxestoEggs(val){
        return Math.floor(val)*210 + + (Math.abs(val) - Math.abs(Math.floor(val))) * 300;
    }
  }