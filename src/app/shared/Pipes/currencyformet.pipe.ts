import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'currency'})
export class Currency implements PipeTransform {
     transform(currency: any): any {
         
         return Number(currency).toLocaleString('en-IN')
       }
   }