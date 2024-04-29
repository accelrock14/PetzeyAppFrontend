import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPet } from '../../models/Pets/IPet';

@Injectable({
  providedIn: 'root'
})
export class VetsserviceService {

  constructor(private http:HttpClient) { }


  getHighRatedVets():Observable<IPet>{

    const url=""
    return this.http.get<IPet>(url)

  }


  getAllVets():Observable<IPet[]>{
    const url=""
    return this.http.get<IPet[]>(url);

  }

  


}
