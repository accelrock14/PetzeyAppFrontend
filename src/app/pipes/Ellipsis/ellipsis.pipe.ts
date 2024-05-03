import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string): string {
    if (value.length <= 10) {
      return value;
    } else {
      return value.substring(0, 10) + '...';
    }
  }

}
