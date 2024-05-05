import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportLoggingService {
  constructor(private http: HttpClient) { }

  logError() {
    this.http
      .post(
        'https://petzeyappointments-default-rtdb.asia-southeast1.firebasedatabase.app/errorlog.json',
        { error: "this string should be posted as error" }
      )
      .subscribe(
        (response) => console.log('Data posted successfully:', response),
        (error) => console.error('Error posting data:', error)
      );
  }

  fetchErrors() {
    this.http
      .get(
        'https://petzeyappointments-default-rtdb.asia-southeast1.firebasedatabase.app/errorlog.json'
      )
      .subscribe((d) => console.log(d));
  }
}

export interface LogData {
  statusCode: number;
  errorMessage: string;
  date: Date;
}

