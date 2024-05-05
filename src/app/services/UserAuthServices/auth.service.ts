import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { appointmentServiceUrl } from '../../Shared/apiUrls';
import { User } from '../../models/User-Authentication/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userPayload: any;

  constructor(private http: HttpClient) {}

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

  getLoggedInUserObject() {
    this.userPayload = this.decodedToken();
    if (this.userPayload) {
      return this.userPayload;
    }
  }

  getUIDFromToken() {
    this.userPayload = this.decodedToken();
    if (this.userPayload) {
      return this.userPayload.oid;
    }
  }

  getRoleFromToken() {
    this.userPayload = this.decodedToken();
    if (this.userPayload) {
      return this.userPayload.extension_role;
    }
  }

  getVPIFromToken() {
    if (this.getRoleFromToken() == 'Doctor') {
      this.userPayload = this.decodedToken();
      if (this.userPayload) {
        return this.userPayload.extension_NPINumber;
      }
    }
  }

  getAllUsers() {
    return this.http.get<any>(appointmentServiceUrl + 'api/Auth');
  }

  getUserByID(UID: string) {
    return this.http.get<string>(appointmentServiceUrl + 'api/Auth/' + UID);
  }

  //returns any type of user based on User ID
  getOwnerByID(UID: string) {
    this.http.get<User[]>("").subscribe({
      next: (users) => {
        return users.find((user)=>user.Id === UID);
      },
      error: (error)=>{
        console.error(error.error.Message);
      }
    })
  }

  // returns Doctor based on NPI id or null if the NPI id is not found
  getDoctorByNPI(NPI: string) {
    this.http.get<User[]>("").subscribe({
      next: (users) => {
        return users.find((user)=>user.Npi === NPI);
      },
      error: (error)=>{
        console.error(error.error.Message);
      }
    })
  }

  getAllPetOwners(){
    this.http.get<User[]>("").subscribe({
      next: (users) => {
        return users.filter((user)=>user.Role==="Owner")
      },
      error: (error)=>{
        console.error(error.error.Message);
      }
    })
  }
}
