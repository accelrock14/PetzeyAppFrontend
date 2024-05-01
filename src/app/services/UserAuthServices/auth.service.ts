import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userPayload: any;

  logOut() {
    localStorage.clear();
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    if (token) return jwtHelper.decodeToken(token);
    else return null;
  }

  getLoggedInUserObject(){
    this.userPayload = this.decodedToken();
    if(this.userPayload){
    return this.userPayload;
  }
  }

  getUIDFromToken(){
    this.userPayload = this.decodedToken();
    if(this.userPayload){
    return this.userPayload.oid;
  }}

  getRoleFromToken(){
    this.userPayload = this.decodedToken();
    if(this.userPayload){
    return this.userPayload.extension_role;
  }}
}
