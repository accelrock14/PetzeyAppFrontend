import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorLoggingService {
  constructor(private http: HttpClient) {}

  logError(data: LogData) {
    this.http
      .post(
        'https://petzeyerrorlogging-300bc-default-rtdb.asia-southeast1.firebasedatabase.app/errologs.json',
        data
      )
      .subscribe(
        (response) => console.log('Data posted successfully:', response),
        (error) => console.error('Error posting data:', error)
      );
  }

  fetchErrors() {
    this.http
      .get(
        'https://petzeyerrorlogging-300bc-default-rtdb.asia-southeast1.firebasedatabase.app/errologs.json'
      )
      .subscribe((d) => console.log(d));
  }
}

export interface LogData {
  statusCode: number;
  errorMessage: string;
  date: Date;
}
