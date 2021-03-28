import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyTotext'
})
export class KeyTotextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    console.log(value);
    if(value !== '') {
      let i, frags = value.split('_');
      for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    }
  }

}
