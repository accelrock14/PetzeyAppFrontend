import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IPet } from '../../models/Pets/IPet';
import { IPetFilterParams } from '../../models/Pets/IPetFilterParams';
import { HttpClient } from '@angular/common/http';
import { NumberSymbol } from '@angular/common';
import { petsServiceUrl } from '../../Shared/apiUrls';
import { defaultEquals } from '@angular/core/primitives/signals';
import { DYNAMIC_TYPE } from '@angular/compiler';
import { IPetCardDto } from '../../models/Pets/IPetCardDto';
import { IPetsFiltered } from '../../models/Pets/IPetsFiltered';
import { Allergy } from '../../models/Pets/IAllergy';
import { IPetAllergy } from '../../models/Pets/IPetAllergy';
import { IPetAndAllergy } from '../../models/Pets/IPetAndAllergy';
import { IPetGridDto } from '../../models/Pets/IPetGridDto';

export interface IPetsService{
  GetAllPets():Observable<IPet[]>;
  FilterPets(petfilters:IPetFilterParams):Observable<number[]>;
  FilterPetsPaged(petfilters:IPetFilterParams, pageNumber:number, pageSize:number):Observable<IPetsFiltered>;
  FilterPetsPerPage(petfilters: IPetFilterParams, pageNumber:number, pageSize:number): Observable<IPet[]>;
  GetPetDetailsByID(petID:number):Observable<IPet>;
  AddPet(petToBeAdded:IPetAndAllergy):Observable<IPet>;
  EditPet(petToBeEdited:IPetAndAllergy):Observable<IPet>;
  GetPetsByParentID(petParentID:string):Observable<IPet[]>;
  DeletePetByPetID(petID:number):Observable<object>;
  AddLastAppointmentDate(ID:number,date:Date):void;
  GetPetsCount(petsFilter: IPetFilterParams): Observable<number>;
  GetPetsByPetIDs(petIds:number[]): Observable<IPetCardDto[]>;
}
export let petToken = new InjectionToken<IPetsService>('IPetsToken')


@Injectable({
  providedIn: 'root'
})
export class PetsService implements IPetsService{

  constructor(private apiService:HttpClient) {

  }

  GetAllPets(): Observable<IPet[]> {
    const apiUrlGetAllPets = `${petsServiceUrl}`;
    return this.apiService.get<IPet[]>(apiUrlGetAllPets);
  }
  FilterPets(petfilters: IPetFilterParams): Observable<number[]> {
    const apiUrlFilterPets = `${petsServiceUrl}/filter`;
    return this.apiService.post<number[]>(apiUrlFilterPets, petfilters);
  }

  FilterPetIds(petfilters: IPetFilterParams): Observable<number[]> {
    const apiUrlFilterPets = `${petsServiceUrl}/filter/petIds`;
    return this.apiService.post<number[]>(apiUrlFilterPets, petfilters);
  }


  FilterPetsPaged(petfilters:IPetFilterParams, pageNumber:number, pageSize:number):Observable<IPetsFiltered>{
    const apiUrlFilterPets = `${petsServiceUrl}/filter/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.apiService.post<IPetsFiltered>(apiUrlFilterPets, petfilters);
  }
  FilterPetsPerPage(petfilters: IPetFilterParams, pageNumber:number, pageSize:number): Observable<IPet[]> {
    const apiUrlFilterPets = `${petsServiceUrl}/filters?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.apiService.post<IPet[]>(apiUrlFilterPets, petfilters);
  }

  GetPetDetailsByID(petID: number): Observable<IPet> {
    const apiUrlGetPetDetailsByID =`${petsServiceUrl}/details/${petID}`;
    return this.apiService.get<IPet>(apiUrlGetPetDetailsByID);
  }

  AddPet(petToBeAdded: IPetAndAllergy): Observable<IPet> {
    const apiUrlAddPet=`${petsServiceUrl}/addnewpet`;
    return this.apiService.post<IPet>(apiUrlAddPet, petToBeAdded);
  }
  EditPet(petToBeEdited: IPetAndAllergy): Observable<IPet> {
    const apiUrlPetToBeEdited = `${petsServiceUrl}`;
    return this.apiService.put<IPet>(apiUrlPetToBeEdited,petToBeEdited);
  }
  GetPetsByParentID(petParentID: string): Observable<IPet[]> {
    const apiUrlGetPetsbyParentId = `${petsServiceUrl}/parentid/${petParentID}`;
    return this.apiService.get<IPet[]>(apiUrlGetPetsbyParentId)
  }

  DeletePetByPetID(petID: number): Observable<object> {
    const apiUrlDeletePetbyID=`${petsServiceUrl}/${petID}`;
    return this.apiService.delete(apiUrlDeletePetbyID)
  }
  AddLastAppointmentDate(petID: number, date: Date) {
    const apiUrlAddLastAppointmentDate=`${petsServiceUrl}/AddLastAppointmentDate/${petID}`;
    const tempDate: Date = new Date(date)
    this.apiService.put(apiUrlAddLastAppointmentDate,tempDate).subscribe()
  }

  GetPetsCount(petsFilter: IPetFilterParams): Observable<number>{
    const apiUrl = `${petsServiceUrl}/filters/count`;
    return this.apiService.post<number>(apiUrl,petsFilter)
  }

  GetPetsByPetIDs(petIds:number[]): Observable<IPetCardDto[]> {
    const apiUrl = `${petsServiceUrl}/getPetsByIDs`;
    return this.apiService.post<IPetCardDto[]>(apiUrl, petIds)
  }

  GetPetsGridByPetIDs(petIds:number[]): Observable<IPetGridDto[]> {
    const apiUrl = `${petsServiceUrl}/getPetsGridDetailsByIDs`;
    return this.apiService.post<IPetGridDto[]>(apiUrl, petIds)
  }

  GetAllAllergies(): Observable<Allergy[]>{
    const apiUrl = `https://localhost:44374/api/pets/Allergies`;
    return this.apiService.get<Allergy[]>(apiUrl);
  }

  GetPetAllergiesByPetID(PetID:number) : Observable<number[]>{
    const apiUrl = `${petsServiceUrl}/PetAllergies/${PetID}`;
    return this.apiService.get<number[]>(apiUrl);
  }


}
