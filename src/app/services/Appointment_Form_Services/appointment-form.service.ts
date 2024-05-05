import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { PetsService } from '../PetsServices/pets.service';
import { IPet } from '../../models/Pets/IPet';
import { VetsserviceService } from '../VetsServices/vetsservice.service';
import { AuthService } from '../UserAuthServices/auth.service';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { IVet } from '../../models/Vets/IVet';
import { TempPetParent } from '../../models/TempPetParent';
import { forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AppointmentFormService {


  petService = inject(PetsService);
  vetService = inject(VetsserviceService);
  authService = inject(AuthService);

  constructor(private backendClient:HttpClient) {
      this.petService = inject(PetsService);
      this.vetService = inject(VetsserviceService);
      this.authService = inject(AuthService);
   }


  private generalPetIssuesUrl = 'https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/AppointmentDetails/GeneralPetIssues';
  //private myJsonServerUrl='http://localhost:3000/';
  private postAppointmentUrl="https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment";
  private getScheduleSlotsUrl="https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/AppointmentDetails/schedules/";
  private getAppointmentByIdUrl='https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment/';
  private editAppointmentUrl = "https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment/https://localhost:44327/api/Appointment/";

  getGeneralPetIssues():Observable<GeneralPetIssue[]>{
    return this.backendClient.get<GeneralPetIssue[]>(this.generalPetIssuesUrl);
  }

  getVeternarians():Observable<IVetCardDTO[]>{
    return this.vetService.getAllVets();
  }

  getVet(): Observable<IVet> {
    // this is correct vpi number.
    console.log(this.authService.getVPIFromToken());
    console.log(this.vetService.getVetsByNPINumber(1234)); // here I need to subscribe...
    // tomorrow I should do that now I am sleepy
    // this.vetService.getVetsByNPINumber(parseInt(this.authService.getVPIFromToken())).subscribe({
    //   next:(data)=>{
    //     return data;
    //   },
    //   error:(err)=>{
    //     console.log(err);
    //   }
    // });
    return this.vetService.getVetsByNPINumber(this.authService.getVPIFromToken()).pipe(
      catchError((err) => {
        console.error(err);
        throw 'Error fetching vet details'; // Rethrow or handle as per your error handling strategy
      })
    );
    return this.vetService.getVetsByNPINumber(this.authService.getVPIFromToken() as number);
  }

  getPetParents(): Observable<TempPetParent[]> {
    // Observable to fetch all users and map them
    const users$ = this.authService.getAllUsers().pipe(
      map(data => Object.entries(data).map(([id, name]) => ({ id, name })))
    );

    // Observable to fetch all pets
    const pets$ = this.petService.GetAllPets();

    // Using forkJoin to wait for both requests to complete
    return forkJoin([users$, pets$]).pipe(
      map(([users, pets]) => {
        const parents: TempPetParent[] = [];
        users.forEach(user => {
          pets.forEach(pet => {
            if (user.id === pet.PetParentID) {
              parents.push({
                PetParentID: pet.PetParentID,
                PetParentName: user.name as string
              });
            }
          });
        });
        return parents;
      })
    );
  }

  // getPetParents():Observable<TempPetParent[]>{
  //   //return this.backendClient.get<TempPetParent[]>(this.myJsonServerUrl+"PetParents");
  //   // here call the auth service method to either retrieve all the pet parents or all the users and then filter them.

  //   // first fetch all users
  //   let users:any[];
  //   this.authService.getAllUsers().subscribe({
  //     next: (data) => {
  //       users = Object.entries(data).map(([id, name]) => ({ id, name }));
  //       console.log(users);

  //       // next fetch all pets from
  //   let pets:IPet[];
  //   this.petService.GetAllPets().subscribe({
  //     next:(data)=>{
  //       pets=data;
  //       console.log("fetched all pets in service to retrieve the parents");

  //       // now filter accordingly
  //   let Parents:TempPetParent[]=[];
  //   for(let i=0;i<users.length;i++){
  //       for(let j=0;j<pets.length;j++){
  //         if(users[i].id == pets[j].PetParentId){
  //           let par:TempPetParent={
  //             PetParentID: pets[j].PetParentId,
  //             PetParentName: users[i].name
  //           };
  //           Parents.push(par);
  //         }
  //       }
  //   }
  //   return Parents;

  //     },
  //     error:(err)=>{
  //       console.log(err+" error occured ");
  //     }
  //   });

  //     },
  //     error: (error) => {
  //       console.error('There was an error!', error);
  //     }
  //   });

  // }

  // no use of this method now.
  // getPets():Observable<IPet[]>{
  //   return this.backendClient.get<IPet[]>(this.myJsonServerUrl+"Pets");
  // }

  getScheduleSlotStatuses(doctorID:string,schDate:Date):Observable<boolean[]>{
    const formattedDate = schDate.toISOString().split('T')[0];
    //alert(this.getScheduleSlotsUrl+id+"/"+formattedDate);
    return this.backendClient.get<boolean[]>(this.getScheduleSlotsUrl+doctorID+"/"+formattedDate);
  }

  postAppointment(appointment:AppointmentDetail):Observable<AppointmentDetail>{
    // alert("inside post appointment");
    return this.backendClient.post<AppointmentDetail>(this.postAppointmentUrl,appointment);
  }

  getAppointmentById(AppointmentID:number):Observable<AppointmentDetail>{
    return this.backendClient.get<AppointmentDetail>(this.getAppointmentByIdUrl+AppointmentID);
  }

  putAppointmentByIdandObj(AppointmentID:number,AppointmentDetailObj:AppointmentDetail):Observable<AppointmentDetail>{
    return this.backendClient.put<AppointmentDetail>(this.editAppointmentUrl+AppointmentID,AppointmentDetailObj);
  }

  getAllPetsOfOwener(OwnerID: string):Observable<IPet[]> {
    return this.petService.GetPetsByParentID(OwnerID);
  }
}
