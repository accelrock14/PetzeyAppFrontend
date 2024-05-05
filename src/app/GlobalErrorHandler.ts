import { Status } from './models/Status';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injector, NgZone, inject } from '@angular/core';
import {
  ErrorLoggingService,
  GeneralLogData,
} from './services/ErrorLogging/error-logging.service';

export class GlobalErrorHandler implements ErrorHandler {
  private _errorLogger: ErrorLoggingService;
  constructor() {
    this._errorLogger = inject(ErrorLoggingService);
  }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      return;
    }

    console.log('caught an error in global error handeler:- ' + error);
    var dataToLog: GeneralLogData = {
      errorMessage: error.message,
      stackTrace: error.stack,
      date: new Date(),
    };
    this._errorLogger.logError(dataToLog);
  }
}
