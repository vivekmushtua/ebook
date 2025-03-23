import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private secretKey = 'your-secret-key';

  constructor() { }

  createJwt(payload: any): Observable<object>  {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const base64Header = this.encodeBase64(JSON.stringify(header));
    const base64Payload = this.encodeBase64(JSON.stringify(payload));

    const signature = this.createSignature(base64Header, base64Payload);

    const tokenData = {
      token:`${base64Header}.${base64Payload}.${signature}`
    }
    return of(tokenData);
  }
  private encodeBase64(data: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
  }

  private createSignature(base64Header: string, base64Payload: string): string {
    const data = `${base64Header}.${base64Payload}`;
    const hash = CryptoJS.HmacSHA256(data, this.secretKey);
    return CryptoJS.enc.Base64.stringify(hash);
  }

  signDataWithCryptoJS(data: string): string {
    const encryptedData = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    return encryptedData;
  }

  decodeJwt(token: string): any {
    return jwtDecode(token);
  }

}
