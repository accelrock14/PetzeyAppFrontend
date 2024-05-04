import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';

export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      return;
    }
    console.log('caught an error in global error handeler:- ' + error.message);
  }
}
