import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatName',
  standalone: true
})


export class FormatName implements PipeTransform {

  transform(value: string): string {
    if (value.length < 10) {
      return value;
    } else {
      return value.substring(0, 10) + '..';
    }
  }

}
