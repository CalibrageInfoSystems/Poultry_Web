import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titleCase' })
export class TitleCasePipe implements PipeTransform {
    constructor() {
    }
    public transform(input: string): string {
        console.log(input);
        if (!input) {
            return '';
        } else {
            return input.replace(/\b\w/g, first => first.toLocaleUpperCase())
            // /^./
        }
    }
}
