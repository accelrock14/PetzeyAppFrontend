import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {

  transform(value: Date): string {
    if (!value) {
      return '';
    }

    const datePipe = new DatePipe('en-US');
    const day = Number(datePipe.transform(value, 'd'));
    const ordinalSuffix = this.getOrdinalSuffix(day);
    const month = datePipe.transform(value, 'MMMM');  // Use 'MMMM' for full month name
    const year = datePipe.transform(value, 'yyyy');

    return `${day} ${month} ${year}`;
  }


  getOrdinalSuffix(day: number) {
    const suffixes = ['','st', 'nd', 'rd', 'th'];
    const remainder = day % 100;
    return (remainder - 10 < 0 || remainder > 20) ?
      suffixes[remainder % 10] : suffixes[remainder - 10];
  }
}

