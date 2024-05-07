import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName',
  standalone: true
})
export class FirstNamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Split the value by space
    const words = value.split(' ');

    // Get the first word
    let firstName = words[0];

    // If the first word has more than 10 characters, truncate it and add ellipsis
    if (firstName.length > 10) {
      firstName = firstName.substring(0, 7) + '..';
    }

    return firstName;
  }

}