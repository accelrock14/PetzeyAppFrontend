import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { User } from '../../models/User-Authentication/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { appointmentServiceUrl } from '../../Shared/apiUrls';
import { throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should remove token on logout', () => {
    service.logOut();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should store token', () => {
    const token = 'dummyToken';
    service.storeToken(token);
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should return true if user is logged in', () => {
    const token = 'dummyToken';
    localStorage.setItem('token', token);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false if user is not logged in', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return the UID from the token', () => {
    const tokenPayload = { oid: 'userId' };
    spyOn(service, 'decodedToken').and.returnValue(tokenPayload);
    const uid = service.getUIDFromToken();
    expect(uid).toEqual('userId');
  });

  it('should return the role from the token', () => {
    const tokenPayload = { extension_role: 'role' };
    spyOn(service, 'decodedToken').and.returnValue(tokenPayload);
    const role = service.getRoleFromToken();
    expect(role).toEqual('role');
  });

  it('should return the NPI from the token for a doctor role', () => {
    const tokenPayload = { extension_role: 'Doctor', extension_NPINumber: 'NPI123' };
    spyOn(service, 'decodedToken').and.returnValue(tokenPayload);
    const npi = service.getVPIFromToken();
    expect(npi).toEqual('NPI123');
  });

  it('should get all user IDs and names', () => {
    const dummyData = [{ id: '1', name: 'User1' }, { id: '2', name: 'User2' }];
    service.getAllUserIDsandNames().subscribe((data: any) => {
      expect(data).toEqual(dummyData);
    });
    const req = httpMock.expectOne(`${appointmentServiceUrl}api/getalluseridsandname`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should get all users', () => {
    const dummyData = [{ id: '1', name: 'User1' }, { id: '2', name: 'User2' }];
    service.getAllUsers().subscribe((data: any) => {
      expect(data).toEqual(dummyData);
    });
    const req = httpMock.expectOne(`${appointmentServiceUrl}api/getalluserobjects`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

});
