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
import { Allergy } from '../../models/Pets/IAllergy';
import { IPetAllergy } from '../../models/Pets/IPetAllergy';

export interface IPetsService{
  GetAllPets():Observable<IPet[]>;
  FilterPets(petfilters:IPetFilterParams):Observable<IPet[]>;
  FilterPetsPerPage(petfilters: IPetFilterParams, pageNumber:number, pageSize:number): Observable<IPet[]>;
  GetPetDetailsByID(petID:number):Observable<IPet>;
  AddPet(petToBeAdded:IPet):Observable<IPet>;
  EditPet(petToBeEdited:IPet):Observable<IPet>;
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
  FilterPets(petfilters: IPetFilterParams): Observable<IPet[]> {
    const apiUrlFilterPets = `${petsServiceUrl}/filter`;
    return this.apiService.post<IPet[]>(apiUrlFilterPets, petfilters);
  }
  FilterPetsPerPage(petfilters: IPetFilterParams, pageNumber:number, pageSize:number): Observable<IPet[]> {
    const apiUrlFilterPets = `${petsServiceUrl}/filters?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.apiService.post<IPet[]>(apiUrlFilterPets, petfilters);
  }
  
  GetPetDetailsByID(petID: number): Observable<IPet> {
    const apiUrlGetPetDetailsByID =`${petsServiceUrl}/details/${petID}`;
    return this.apiService.get<IPet>(apiUrlGetPetDetailsByID);
  }
 
  AddPet(petToBeAdded: IPet): Observable<IPet> {
    const apiUrlAddPet=`${petsServiceUrl}/addnewpet`;
    return this.apiService.post<IPet>(apiUrlAddPet, petToBeAdded);
  }
  EditPet(petToBeEdited: IPet): Observable<IPet> {
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

  GetAllAllergiesWithFilter (allergy:string): Observable<Allergy[]>{
    const apiUrl = `${petsServiceUrl}/Allergies`;
    return this.apiService.post<Allergy[]>(apiUrl, allergy);
  }

  GetPetAllergiesByPetID(PetID:number) : Observable<IPetAllergy[]>{
    const apiUrl = `${petsServiceUrl}/PetAllergies/${PetID}`;
    return this.apiService.get<IPetAllergy[]>(apiUrl);
  }
  
  AddPetAllergy(PetAllergy:IPetAllergy):void {
    const apiUrl = `${petsServiceUrl}/addPetAllergy`;
    this.apiService.post(apiUrl, PetAllergy);
  }

  DeletePetAllergy(PetID:number):void{
    const apiUrl = `${petsServiceUrl}/deletePetAllergy/${PetID}`;
    this.apiService.delete(apiUrl);
  }



}
