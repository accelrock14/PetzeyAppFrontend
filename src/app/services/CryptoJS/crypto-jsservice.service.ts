import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoJSServiceService {
  key = 'encrypt!135790';

  constructor() {}

  encrypt(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.key
    ).toString();
    return encryptedData;
  }

  decrypt(encryptedData: string): any {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.key);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}
