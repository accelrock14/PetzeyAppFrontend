import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IPet } from '../../models/Pets/IPet';
import { IPetFilterParams } from '../../models/Pets/IPetFilterParams';
import { HttpClient } from '@angular/common/http';
import { NumberSymbol } from '@angular/common';

export interface IPetsService{
  GetAllPets():Observable<IPet[]>;
  FilterPets(petfilters:IPetFilterParams):Observable<IPet[]>;
  GetPetsByIDs(petIDs:number[]):Observable<IPet[]>;
  GetPetDetailsByID(petID:number):Observable<IPet>;
  GetMorePets(pageNumber:number):Observable<IPet[]>;
  AddPet(petToBeAdded:IPet):Observable<IPet>;
  EditPet(petToBeEdited:IPet):Observable<IPet>;
  GetPetsByParentID(petParentID:number):Observable<IPet[]>;
  GetPetsByPetIDinDTO(petIDs:number[]):Observable<IPet[]>;
  DeletePetByPetID(petID:number):Observable<object>;
  AddLastAppointmentDate(ID:number,date:Date):Observable<object>;
}
export let petToken = new InjectionToken<IPetsService>('IPetsToken')


@Injectable({
  providedIn: 'root'
})
export class PetsService implements IPetsService{

  constructor(private apiService:HttpClient) {
    
   }

  GetAllPets(): Observable<IPet[]> {
    const apiUrlGetAllPets = "";
    return this.apiService.get<IPet[]>(apiUrlGetAllPets);
  }
  FilterPets(petfilters: IPetFilterParams): Observable<IPet[]> {
    const apiUrlFilterPets = "";
    return this.apiService.post<IPet[]>(apiUrlFilterPets, petfilters);
  }
  GetPetsByIDs(petIDs: number[]): Observable<IPet[]> {
    const apiUrlGetPetsByIDs = "";
    return this.apiService.post<IPet[]>(apiUrlGetPetsByIDs,petIDs)
  }
  GetPetDetailsByID(petID: number): Observable<IPet> {
    const apiUrlGetPetDetailsByID ="";
    return this.apiService.get<IPet>(apiUrlGetPetDetailsByID);
  }
  GetMorePets(pageNumber: number): Observable<IPet[]> {
    const apiUrlGetMorePets ="";
    return this.apiService.post<IPet[]>(apiUrlGetMorePets,pageNumber);
  }
  AddPet(petToBeAdded: IPet): Observable<IPet> {
    const apiUrlAddPet="";
    return this.apiService.post<IPet>(apiUrlAddPet, petToBeAdded);
  }
  EditPet(petToBeEdited: IPet): Observable<IPet> {
    const apiUrlPetToBeEdited = "";
    return this.apiService.put<IPet>(apiUrlPetToBeEdited,petToBeEdited);
  }
  GetPetsByParentID(petParentID: number): Observable<IPet[]> {
    const apiUrlGetPetsbyParentId = "";
    return this.apiService.get<IPet[]>(apiUrlGetPetsbyParentId)
  }
  GetPetsByPetIDinDTO(petIDs:number[]):Observable<IPet[]>{
    const apiUrlGetPetsInDTO = "";
    return this.apiService.post<IPet[]>(apiUrlGetPetsInDTO,petIDs)
  }
  DeletePetByPetID(petID: number): Observable<object> {
    const apiUrlDeletePetbyID="";
    return this.apiService.delete(apiUrlDeletePetbyID)
  }
  AddLastAppointmentDate(ID: number, date: Date): Observable<object> {
    const apiUrlAddLastAppointmentDate="";
    return this.apiService.put(apiUrlAddLastAppointmentDate,date)
  }
}