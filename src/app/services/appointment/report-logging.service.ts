import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportLoggingService {
  constructor(private http: HttpClient) {}

  logError(data: LogData) {
    this.http
      .post(
        'https://errorlogging-f37b2-default-rtdb.firebaseio.com/errologs.json',
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
        'https://errorlogging-f37b2-default-rtdb.firebaseio.com/errologs.json'
      )
      .subscribe((d) => console.log(d));
  }
}

export interface LogData {
  statusCode: number;
  errorMessage: string;
  date: Date;
}
