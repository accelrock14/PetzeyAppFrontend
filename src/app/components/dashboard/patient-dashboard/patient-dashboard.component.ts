import { Component, OnInit } from '@angular/core';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { IDFiltersDto } from '../../../models/Dashboard/IDFiltersDto';
import { IVetIdNameDTO } from '../../../models/Vets/IVetIDNameDto';
import { IPetCardDto } from '../../../models/Pets/IPetCardDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { PetsService } from '../../../services/PetsServices/pets.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, DoctorAppointmentCardComponent,RouterLink],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  user:string = "Patient";
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: '',
    DoctorID: ""
  }


  appointmentCards: AppointmentCardDto[] = [];
  appdocids : number[] = [];
  apppetids : number[] = [];
  appownerids : string[] = [];
  appdocdetails : IVetIdNameDTO[] = [];
  apppetdetails : IPetCardDto[] = [];
  appownerdetails : any[] = [];



  offset : number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  page:number = 1;
  loadingAppointments: boolean = false;
  appointmentStatus: AppointmentStatusCountsDto = {
    Pending: 0,
    Confirmed: 0,
    Cancelled: 0,
    Total: 0,
    Closed: 0
  }
  ids : IDFiltersDto = {
    DoctorID: '',
    OwnerID: ''
  };
  UpcomingappointmentCards: AppointmentCardDto[] = [];
  docids : number[] = [];
  petids : number[] = [];
  ownerids : string[] = [];
  docdetails : IVetIdNameDTO[] = [];
  petdetails : IPetCardDto[] = [];
  ownerdetails : any[] = [];


  constructor(private service: DashboardService,public authService: AuthService,private vetService: VetsserviceService, private petService : PetsService) {}
  ngOnInit(): void {
    // using auth service to get appointments according to OWNER ID
    this.loadingAppointments = true;
    this.getpatientappointments();
    this.ids.OwnerID = this.authService.getUIDFromToken();
    console.log(this.ids);
    this.service.GetStatusCounts(this.ids).subscribe(count => {
      this.appointmentStatus = count;
      this.getUpcomingappointments();
    })
    
  }

  private getUpcomingappointments() {
    this.service.GetUpcomingAppointments(this.ids).subscribe(data => {
      this.UpcomingappointmentCards = data;
      console.log(data)
      this.UpcomingappointmentCards.forEach(element => {
        this.docids.push(parseInt(element.DoctorID));
        this.petids.push(element.PetID);
      });
      this.vetService.getVetsByListOfIds(this.docids).subscribe(data => {
        this.docdetails = data;
        // Loop through upcoming appointment cards to assign doctor details
        this.UpcomingappointmentCards.forEach((element) => {
          const matchingVet = this.docdetails.find(vet => vet.VetId === parseInt(element.DoctorID));
          if (matchingVet) {
            element.DoctorName = matchingVet.Name;
            element.VetSpecialization = matchingVet.Specialization;
            element.DoctorPhoto = matchingVet.Photo;
          }
          else {
            element.DoctorName = "unknown";
            element.VetSpecialization = "unknown";
            element.DoctorPhoto = "unknown";
          }
        });
      });
      this.petService.GetPetsByPetIDs(this.petids).subscribe(data => {
        this.petdetails = data;
        // Loop through upcoming appointment cards to assign pet details
        this.UpcomingappointmentCards.forEach((element) => {
          const matchingPet = this.petdetails.find(pet => pet.PetID === element.PetID);
          if (matchingPet) {
            element.PetName = matchingPet.PetName;
            element.OwnerID = matchingPet.OwnerID;
            // element.PetAge = matchingPet.DateOfBirth
            element.PetGender = matchingPet.PetGender;
            element.PetPhoto = matchingPet.petImage;

          }
          else {
            element.PetName = "unknown";
            element.OwnerID = "unknown";
            // element.PetAge = matchingPet.DateOfBirth
            element.PetGender = "unknown";
          }
        });
      });
      this.authService.getAllUserIDsandNames().subscribe(
        (ownerData: { [userID: string]: string; }) => {
          // Iterate through UpcomingappointmentCards and assign owner names
          this.UpcomingappointmentCards.forEach((appointment) => {
            if (appointment.OwnerID && ownerData.hasOwnProperty(appointment.OwnerID)) {
              appointment.OwnerName = ownerData[appointment.OwnerID];
            } else {
              appointment.OwnerName = 'Unknown Owner';
            }
          });
        }
      );
    });
  }

  private getpatientappointments() {
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
      this.appointmentCards.forEach(element => {
        this.appdocids.push(parseInt(element.DoctorID));
        this.apppetids.push(element.PetID);
      });
      this.vetService.getVetsByListOfIds(this.appdocids).subscribe(data => {
        this.appdocdetails = data;
        // Loop through upcoming appointment cards to assign doctor details
        this.appointmentCards.forEach((element) => {
          const matchingVet = this.appdocdetails.find(vet => vet.VetId === parseInt(element.DoctorID));
          if (matchingVet) {
            element.DoctorName = matchingVet.Name;
            element.VetSpecialization = matchingVet.Specialization;
            element.DoctorPhoto = matchingVet.Photo;
          }
          else{
            element.DoctorName = "unknown"
            element.VetSpecialization = "unknown"
            element.DoctorPhoto = "unknown"
          }
        });
      })
      this.petService.GetPetsByPetIDs(this.apppetids).subscribe(data =>{
        this.apppetdetails = data;
        // Loop through upcoming appointment cards to assign pet details
        this.appointmentCards.forEach((element) => {
          const matchingPet = this.apppetdetails.find(pet => pet.PetID === element.PetID);
          if (matchingPet) {
            element.PetName = matchingPet.PetName;
            console.log(matchingPet)
            element.OwnerID = matchingPet.OwnerID;
            // element.PetAge = matchingPet.DateOfBirth
            element.PetGender = matchingPet.PetGender;
            element.PetPhoto = matchingPet.petImage;

          }
          else{
            element.PetName = "unknown"
            element.OwnerID = "unknown";
            // element.PetAge = matchingPet.DateOfBirth
            element.PetGender = "unknown";
          }
        });
      });
      this.authService.getAllUserIDsandNames().subscribe(
        (ownerData: { [userID: string]: string }) => {
          // Iterate through appointmentCards and assign owner names
          this.appointmentCards.forEach((appointment) => {
            if (appointment.OwnerID && ownerData.hasOwnProperty(appointment.OwnerID)) {
              appointment.OwnerName = ownerData[appointment.OwnerID];
            } else {
              appointment.OwnerName = 'Unknown Owner';
            }
          });
        }
      );
    });
  }

  onDateStatusChange() {
    //re setting the filters on filter changes
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
  }
  pageClick(pageInput:number) {
    //set offset for pagination
    this.offset = (pageInput-1)*4;
    if(pageInput == this.page - 1){
      this.page--;
    }
    else if(pageInput == this.page + 1) {
      this.page++;
    }
    //set filters and get appointments from service
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
  }
  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.appointmentCards.length == 0;
}
}
