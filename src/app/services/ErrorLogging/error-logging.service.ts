import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorLoggingService {
  constructor(private http: HttpClient) {}

  logError(data: HttpLogData | GeneralLogData) {
    // this.http
    //   .post(
    //     'https://petzeyerrorlogging-300bc-default-rtdb.asia-southeast1.firebasedatabase.app/errologs.json',
    //     data
    //   )
    //   .subscribe(
    //     (response) => console.log('Error logged successfully in firebase:'),
    //     (error) => console.error('Error occured while logging data:', error)
    //   );
  }

  fetchErrors() {
    // this.http
    //   .get(
    //     'https://petzeyerrorlogging-300bc-default-rtdb.asia-southeast1.firebasedatabase.app/errologs.json'
    //   )
    //   .subscribe((d) => console.log(d));
  }
}

export interface HttpLogData {
  statusCode: number;
  errorMessage: string;
  error: any;
  date: Date;
}

export interface GeneralLogData {
  errorMessage: string;
  stackTrace: string;
  date: Date;
}
