import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { Status } from '../../models/Status';
import { PetIssue } from "../../models/PetIssue"
import { AppointmentFormService } from '../../services/Appointment_Form_Services/appointment-form.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/UserAuthServices/auth.service';
import { IPet } from '../../models/Pets/IPet';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { TempPetParent } from '../../models/TempPetParent';
import { VetsserviceService } from '../../services/VetsServices/vetsservice.service';

declare var window: any;
@Component({
  selector: 'app-new-appointment-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, MatSnackBarModule],
  templateUrl: './new-appointment-form.component.html',
  styleUrl: './new-appointment-form.component.css'
})
export class NewAppointmentFormComponent implements OnInit {
  GoBackSimply() {
    this.formModal.hide();
    this.cancelAptModal.hide();
    this.location.back();
  }

  GoBackWithMsg(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000 // message will disappear after 3000ms
    });
    this.formModal.hide();
    this.cancelAptModal.hide();
    this.location.back();
  }

  formModal: any;
  cancelAptModal: any;

  appointmentDetail: AppointmentDetail = {
    AppointmentID: 0,
    DoctorID: "",
    PetID: 0,
    OwnerID: "",
    ScheduleDate: new Date(),
    ScheduleTimeSlot: 0,
    BookingDate: new Date(),
    ReasonForVisit: '',
    Status: Status.Pending,
    Report: null,
    PetIssues: []
  };
  slotStatuses: boolean[] = [];
  selectedScheduleDate: Date = new Date();
  selectedIndex: number | null = null;

  constructor(private aptService: AppointmentFormService, private route: Router, private routeTo: ActivatedRoute, private location: Location, private snackBar: MatSnackBar, private authService: AuthService,private vetService:VetsserviceService) { }

  generalPetIssues: GeneralPetIssue[] = [];
  petIssueSearchText = '';
  //petIssuesNames: string[] = [];// to be fetched from backend and assingned in the ngonit
  filteredpetIssues: GeneralPetIssue[] = [];

  // variable data for vets
  veternarians: IVetCardDTO[] = []; // to be fetched from backend or dummy json server and assigned in oninit method
  veternarianSearchText = '';
  filteredVets: IVetCardDTO[] = [];
  vetDateAndSlotPicker: boolean = false;

  // for pet parents
  // change this TempPetParent to the one that the pets team will provide after meeting
  petParents: TempPetParent[] = [];
  petParentSearchText = '';
  filteredPetParents: TempPetParent[] = [];

  // for pets
  pets: IPet[] = [];
  petSearchText = '';
  filteredPets: IPet[] = [];

  @ViewChild('inputForSelectingVet') inputForSelectingVet?: NgModel;


  What_Flow: string = '';
  isReceptionist: boolean = false;
  isDoctor: boolean = false;
  isOwner: boolean = false;


  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      this.route.navigate(['/signin']);
    }

    this.What_Flow = this.authService.getRoleFromToken() as string;
    if (this.What_Flow == 'Owner') {
      console.log("logged in as " + this.What_Flow);
      this.isOwner = true;
      this.appointmentDetail.OwnerID = this.authService.getUIDFromToken();
    }
    else if (this.What_Flow == 'Doctor') {
      this.isDoctor = true;
      console.log("logged in as " + this.What_Flow);
      
      let npiNumber = this.authService.getVPIFromToken();
      console.log("vpi no = "+npiNumber);
      
      
      this.vetService.getVetsByNPINumber(npiNumber).subscribe({
        next:(data)=>{
          this.appointmentDetail.DoctorID = data.VetId.toString();
          console.log("doc id is "+ this.appointmentDetail.DoctorID);
        },
        error:(err)=>{
          console.log("errrr"+err);
        }
      });

      // window.stop();
    }
    else {
      this.isReceptionist = true;
      console.log("logged in as " + this.What_Flow);
    }

    // modal popup code 
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("myModalPopup")
    );
    this.cancelAptModal = new window.bootstrap.Modal(document.getElementById('myModalPopup-2'));
    //
    this.selectedScheduleDate = new Date();
    // this is the method to getGeneralPetIssues from backend server
    this.aptService.getGeneralPetIssues().subscribe({
      next: (data) => {
        this.generalPetIssues = data;
        //console.log("logging data of generalpetissues",data);
        //console.log("my gpetissues",this.generalPetIssues);
        //this.petIssuesNames = this.generalPetIssues.map(i => i.IssueName);
        this.filteredpetIssues = this.generalPetIssues;
        //console.log("pet isssue names array",this.petIssuesNames);
      },
      error: (err) => { console.error('there was an error in while fetching the generalpetissue in the appointment form ng onint', err) }
    });

    // this is the method to get Veternarians from the backend of other teams api
    if (!this.isDoctor) {
      this.aptService.getVeternarians().subscribe({ // to get all vets. for patient and receptionist
        next: (data) => {
          this.veternarians = data;
          this.filteredVets = this.veternarians;
          console.log(this.veternarians);
        },
        error: (err) => { console.error('there was error in vets fetch', err); }
      });
    }

    // this is the method for fetching pets
    if (this.isOwner) {
      this.aptService.getAllPetsOfOwener(this.authService.getUIDFromToken()).subscribe({
        next: (data) => {
          this.pets = data;
          this.filteredPets = this.pets;
          console.log('pets are ', this.pets);
        },
        error: (err) => { console.log('eror in fetching pets', err); }
      });
    }

    if(this.isDoctor || this.isReceptionist){
      this.aptService.TempAllGetPetParents();
    }

  } // end of ngOninit()
  // modal popup code for submission
  openModal() {
    this.formModal.show();
  }
  closeModal() {
    this.formModal.hide();
  }
  // cancel model
  openCancelModal() {
    this.cancelAptModal.show();
  }
  closeCancelModal() {
    this.cancelAptModal.hide();
  }

  filterPetIssues(): void {
    if (!this.petIssueSearchText.length) {
      this.filteredpetIssues = [];
    }
    else {
      this.filteredpetIssues = this.generalPetIssues.filter(c => c.IssueName.toLowerCase().includes(this.petIssueSearchText.toLowerCase()));
    }
  }

  selectPetIssue(petIssue: string): void {
    this.petIssueSearchText = '';
    // remove element from the general pet issues.
    this.generalPetIssues = this.generalPetIssues.filter(gpi => gpi.IssueName !== petIssue);
    this.filteredpetIssues = [];
    let tempPetIssue: PetIssue = {
      PetIssueID: 0,
      IssueName: petIssue,
    }
    this.appointmentDetail.PetIssues.push(tempPetIssue);
  }

  onDisSelectPetIssue(Pi: PetIssue) {
    this.appointmentDetail.PetIssues = this.appointmentDetail.PetIssues.filter(pi => pi.IssueName !== Pi.IssueName);
  }

  // veternarian methods 
  filterVeternarians(): void {
    if (!this.veternarianSearchText.length) {
      this.filteredVets = [];
      if (this.veternarianSearchText) {
        this.vetDateAndSlotPicker = true;
      } else {
        this.vetDateAndSlotPicker = false;
      }
    }
    else {
      this.filteredVets = this.veternarians.filter(v => v.Name.toLowerCase().includes(this.veternarianSearchText.toLowerCase()));
      if (this.veternarianSearchText) {
        this.vetDateAndSlotPicker = true;
      } else {
        this.vetDateAndSlotPicker = false;
      }
    }
  }
  selectVeternarian(vid: number, vname: string): void {
    // we need to assign for the respective variable in the appointment object
    this.veternarianSearchText = vname;
    this.filteredVets = [];
    if (this.veternarianSearchText) {
      this.vetDateAndSlotPicker = true;
    } else {
      this.vetDateAndSlotPicker = false;
    }
    // by default it should fetch the schedules for today.
    //||||||||||||||||||||||||||| major change in vet ID |||||||||||||||||||||||||||||||||||||
    this.appointmentDetail.DoctorID = vid.toString();
    this.selectedScheduleDate = new Date();
    this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID, new Date(this.selectedScheduleDate)).subscribe({
      next: (data) => {
        this.slotStatuses = data, console.log("default date schedules success", data);
      },
      error: (err) => {
        console.log("error occured array fetch", err);
      }
    });
  }

  onDateChange() {
    //alert("scheduled date"+this.selectedScheduleDate);
    this.appointmentDetail.ScheduleDate = this.selectedScheduleDate;
    this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID, new Date(this.selectedScheduleDate)).subscribe({
      next: (data) => {
        this.slotStatuses = data, console.log("fetched the slots boolean array success", data);
      },
      error: (err) => {
        console.log("error occured while fetching the slots bool array", err);
      }
    });
  }

  isDisabled(index: number): boolean {
    return this.slotStatuses[index];
  }

  isSelected(index: number): boolean {
    this.appointmentDetail.ScheduleTimeSlot = index;
    return index === this.selectedIndex;
  }

  onSlotClick(slot: string, index: number,): void {
    if (!this.isDisabled(index)) {
      console.log('Slot selected:', slot);
      console.log('selected slot index', index);
      this.selectedIndex = index;
      this.appointmentDetail.ScheduleTimeSlot = index;
      // alert("slot index is "+index);
    }
  }

  filterPetParents(): void {
    if (!this.petParentSearchText.length) {
      this.filteredPetParents = [];
    }
    else {
      this.filteredPetParents = this.petParents.filter(pp => pp.PetParentName.toLowerCase().includes(this.petParentSearchText.toLowerCase()));
    }
  }

  selectPetParent(ppid: string, ppname: string): void {
    this.petParentSearchText = ppname;
    this.filteredPetParents = [];
    this.appointmentDetail.OwnerID = ppid;

    // get pets of particular parent.
    // UNCOMMENT THIS LATER AFTER HOISTING. ALSO PUT THIS IN ON SELECT THE PARENT METHOD.
    // ALSO DO THIS IN EDIT THING.
    this.aptService.getAllPetsOfOwener(this.appointmentDetail.OwnerID).subscribe({
      next: (data) => {
        this.pets = data;
      },
      error: (err) => {
        console.log("error while fetching pets of a owener", err);
      }
    });
  }

  // methods for pets 
  filterPets(): void {
    if (!this.petSearchText.length) {
      this.filteredPets = [];
    }
    else {
      this.filteredPets = this.pets.filter(p => p.PetName.toLowerCase().includes(this.petSearchText.toLowerCase()));
    }
  }
  selectPet(petid: number, petname: string) {
    this.petSearchText = petname;
    this.filteredPets = [];
    this.appointmentDetail.PetID = petid;
  }

  timeSlotRows: string[][] = [
    ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
    ['12:00', '12:30', '14:00', '14:30', '15:00', '15:30'],
    ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
  ];

  onBook(reasonforvisit: string) {
    this.appointmentDetail.BookingDate = new Date();
    this.appointmentDetail.ReasonForVisit = reasonforvisit;
    this.appointmentDetail.Status = Status.Pending;
    this.appointmentDetail.Report = null;
    this.appointmentDetail.ScheduleTimeSlot = this.selectedIndex!;
    if(this.isOwner)
    this.appointmentDetail.OwnerID = this.authService.getUIDFromToken();
    // alert("inside booking"+this.appointmentDetail.ScheduleTimeSlot+" - "+this.selectedIndex);
    // alert("inside booking"+this.appointmentDetail.ScheduleTimeSlot+" - "+this.selectedIndex);
    // finally call the service post method.
    // console.log("printing before posting "+ this.appointmentDetail);
    // console.log(this.appointmentDetail.AppointmentID);
    // console.log(this.appointmentDetail.DoctorID);
    // console.log(this.appointmentDetail.OwnerID);
    // console.log(this.appointmentDetail.PetID);
    // console.log(this.appointmentDetail.BookingDate);
    // console.log(this.appointmentDetail.ScheduleTimeSlot);
    // console.log(this.appointmentDetail.PetIssues);
    // console.log(this.appointmentDetail.Report);
    this.aptService.postAppointment(this.appointmentDetail).subscribe({
      next: (response) => { console.log("success---posting", response); },
      error: (err) => { console.log("got error while posting", err); }
    });
    this.closeModal();
    this.GoBackWithMsg('your appointment is added successfully');
  }

  isSubmitDisabled: boolean = true;

  toggleDisabled(): void {
    this.isSubmitDisabled = !this.isSubmitDisabled;
  }

}

