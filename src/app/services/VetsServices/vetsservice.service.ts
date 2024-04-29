import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { IPet } from '../../models/Pets/IPet';
import { IVet } from '../../models/Vets/IVet';
import { IVetProfileDTO } from '../../models/Vets/IVetProfileDto';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { IVetIdNameDTO } from '../../models/Vets/IVetIDNameDto';


@Injectable({
  providedIn: 'root'
})
export class VetsserviceService {

  private apiUrl = 'https://localhost:44304/api/vets';

  constructor(private http: HttpClient) { }

  getAllVets(): Observable<IVetCardDTO[]> {
    return this.http.get<IVetCardDTO[]>(this.apiUrl);
  }

  getVetById(id: number): Observable<IVetProfileDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IVetProfileDTO>(url);
  }

  addVet(vet: IVet): Observable<IVet> {
    return this.http.post<any>(this.apiUrl, vet);
  }

  updateVet(id: number, vet: IVet): Observable<IVet> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IVet>(url, vet);
  }

  deleteVet(id: number): Observable<IVet> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<IVet>(url);
  }

  editStatus(id: number, status: boolean): Observable<IVet> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<IVet>(url, status);
  }

  getVetsByListOfIds(doctorIds: number[]): Observable<IVetIdNameDTO[]> {
    const url = `${this.apiUrl}/VetDetails`;
    return this.http.post<IVetIdNameDTO[]>(url, doctorIds);
  }

  


}
