import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Status } from '../../models/Status';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { PetIssue } from '../../models/PetIssue';
import { AppointmentFormService } from '../../services/Appointment_Form_Services/appointment-form.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/UserAuthServices/auth.service';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { IPet } from '../../models/Pets/IPet';
import { TempPetParent } from '../../models/TempPetParent';
import { PetsService } from '../../services/PetsServices/pets.service';
import { VetsserviceService } from '../../services/VetsServices/vetsservice.service';

declare var window:any;
@Component({
  selector: 'app-edit-appointment-form',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink,MatSnackBarModule],
  templateUrl: './edit-appointment-form.component.html',
  styleUrl: './edit-appointment-form.component.css'
})
export class EditAppointmentFormComponent implements OnInit {
  isFormValid():boolean {
    return this.appointmentDetail.DoctorID!==''&&this.appointmentDetail.PetID!==0&&this.appointmentDetail.OwnerID!==''&&this.appointmentDetail.ScheduleTimeSlot!==0&&this.appointmentDetail.ReasonForVisit!=='';
  }
  
GoBackSimply() {
  this.formModal.hide();
  this.cancelAptModal.hide();
this.location.back();
}

GoBackWithMsg(msg:string){
  this.snackBar.open(msg, '', {
    duration: 3000 // message will disappear after 3000ms
  });
  this.formModal.hide();
  this.cancelAptModal.hide();
this.location.back();
}


  formModal: any;
  cancelAptModal: any;

  // id of appointment to edit;
  AppointmentID: number = 0;
  appointmentDetail: AppointmentDetail = {
    AppointmentID: 0,
    DoctorID: '',
    PetID: 0,
    OwnerID: '',
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
  minDate:string='';
  selectedSlotIndex: number | null = null;

  constructor(private aptService: AppointmentFormService,private route:Router,private routeTo:ActivatedRoute,private location:Location,private snackBar: MatSnackBar,private authService:AuthService,private petService:PetsService,private vetService:VetsserviceService) { }

  generalPetIssues: GeneralPetIssue[] = [];
  petIssueSearchText = '';
  //petIssuesNames: string[] = [];// to be fetched from backend and assingned in the ngonit
  filteredpetIssues: GeneralPetIssue[] = [];

  // variable data for vets
  veternarians: IVetCardDTO[] = []; // to be fetched from backend or dummy json server and assigned in oninit method
  veternarianSearchText = '';
  filteredVets: IVetCardDTO[] = [];
  vetDateAndSlotPicker: boolean = false;

  //// for pet parents
  petParents: TempPetParent[] = [];
  petParentSearchText = '';
  filteredPetParents: TempPetParent[] = [];

  // for pets
  pets: IPet[] = [];
  petSearchText = '';
  filteredPets: IPet[] = [];

  What_Flow:string='';
  isReceptionist:boolean=false;
  isDoctor:boolean=false;
  isOwner:boolean=false;
 
  ngOnInit(): void {
    
    if(!this.authService.isLoggedIn()){
      this.route.navigate(['/signin']);
    }

    this.What_Flow = this.authService.getRoleFromToken() as string;
    if(this.What_Flow=='Owner'){
      this.isOwner = true;
    }
    else if(this.What_Flow=='Doctor'){
      this.route.navigate(['/home']);
      this.isDoctor = true;
      
        this.vetService.getVetsByNPINumber(this.authService.getVPIFromToken()).subscribe({
          next:(data)=>{
            this.appointmentDetail.DoctorID = data.VetId.toString();
            console.log("doctor id assigned success");
          },
          error:(err)=>{
            console.log("error occured while getting vet"+err);
          }
        });
      
    }
    else{
      this.route.navigate(['/home']);
      this.isReceptionist=true;
    }

    
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // getMonth() is zero-based
    let dd = today.getDate();
    this.minDate = `${yyyy}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`;

    this.AppointmentID=parseInt(this.routeTo.snapshot.paramMap.get('AppointmentID')!) as number;
    this.aptService.getAppointmentById(this.AppointmentID).subscribe({
      next: (data) => {
        this.appointmentDetail = data;
        this.AppointmentID = this.appointmentDetail.AppointmentID;
        this.selectedScheduleDate = this.appointmentDetail.ScheduleDate;
        this.selectedSlotIndex=this.appointmentDetail.ScheduleTimeSlot;
        
        this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID,new Date(this.appointmentDetail.ScheduleDate)).subscribe({
          next:(data)=>{
            console.log(data+"data here");
            this.slotStatuses = data;
            this.slotStatuses[this.appointmentDetail.ScheduleTimeSlot]=false;
            console.log("printing time slot here"+this.appointmentDetail.ScheduleTimeSlot+" "+this.slotStatuses[this.appointmentDetail.ScheduleTimeSlot]);
          },
          error:(err)=>{
            console.log("error in oninit slot status fetching",err);
            
          }
        });//
        console.log("feteched appointmetnDetail for editing", data);
      },
      error: (err) => {
        console.log("error occured while fetching appointment detail by id in edit appointment component", err);
      }
    });

    

    this.formModal= new window.bootstrap.Modal(document.getElementById("exampleModal"));
    this.cancelAptModal = new window.bootstrap.Modal(document.getElementById('cancelEditModal'));
    //

    this.aptService.getVeternarians().subscribe({
      next: (data: IVetCardDTO[]) => {
        for (let i = 0; i < data.length; i++) {
          //console.log(typeof data[i].id + " and "+typeof this.appointmentDetail.DoctorID);
          // LATER I HAVE TO MAKE IT AS ===
          if (data[i].VetId as unknown as string == this.appointmentDetail.DoctorID) {
            this.veternarianSearchText = data[i].Name;
          }
        }
      },
      error: (err) => { console.log("error in getting vets data", err); }
    });

    // temporarily fetch all pets.
    // this.aptService.getPets().subscribe({
    //   next:(data)=>{
    //     const foundItem = data.find((p) => p.id == this.appointmentDetail.PetID);
    //     if (foundItem) {
    //       this.petSearchText = foundItem.name;
    //     } else {
    //       this.petSearchText = 'Default pet Name'; // Or handle the undefined case differently
    //     }
    //   },
    //   error:(err)=>{
    //     console.log("errorrrrr",err);
    //   }
    // });

    this.aptService.getGeneralPetIssues().subscribe({
      next: (data) => {
        if (this.appointmentDetail.PetIssues && this.appointmentDetail.PetIssues.length > 0) {
          const firstIssueName = this.appointmentDetail.PetIssues[0].IssueName;
          this.petIssueSearchText = data.find(pi => { 
          return pi.IssueName == firstIssueName;
           })?.IssueName || 'No Issue Found';
        } else {
          // Handle the case where there are no pet issues
          this.petIssueSearchText = 'Default Issue Name';
        }
      },
      error: (err) => {
        console.log("error", err);
      }
    });

    // this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID, new Date(this.selectedScheduleDate)).subscribe({
    //   next: (data) => {
    //     this.slotStatuses = data, console.log("default date schedules success", data);
    //   },
    //   error: (err) => {
    //     console.log("error occured array fetch", err);
    //   }
    // });

    // modal popup code 
    // this.formModal= new window.bootstrap.Modal(
    //   document.getElementById("exampleModal")
    // );
    // this.cancelAptModal = new window.bootstrap.Modal(document.getElementById('exampleModal2'));
    //
    //this.selectedScheduleDate = new Date();
    // this is the method to getGeneralPetIssues from backend server
    this.aptService.getGeneralPetIssues().subscribe({
      next: (data) => {
        this.generalPetIssues = data;
        //console.log("logging data of generalpetissues",data);
        //console.log("my gpetissues",this.generalPetIssues);
        this.filteredpetIssues = this.generalPetIssues;
      },
      error: (err) => { console.error('there was an error in while fetching the generalpetissue in the appointment form ng onint', err) }
    });

    // this is the method to get Veternarians from the backend of other teams api
    this.aptService.getVeternarians().subscribe({
      next: (data) => {
        this.veternarians = data;
        this.filteredVets = this.veternarians;
        console.log(this.veternarians);
      },
      error: (err) => { console.error('there was error in vets fetch', err); }
    });

    // this is the method for fetching pets
    if (this.isOwner) {
      // get pets of particular parent.
    // UNCOMMENT THIS LATER AFTER HOISTING. ALSO PUT THIS IN ON SELECT THE PARENT METHOD.
    // ALSO DO THIS IN EDIT THING.
    this.petService.GetPetsByParentID(this.authService.getUIDFromToken()).subscribe({
      next:(data)=>{
        this.pets = data;
        this.filteredPets = this.pets;
        data.forEach((d)=>{
          if(d.PetID==this.appointmentDetail.PetID){
            this.petSearchText = d.PetName;
          }
        });
        console.log(" fetched the pets of ownere "+data);
      },
      error:(err)=>{
        console.log("error occured while fetching the pet for parent + "+this.authService.getUIDFromToken()+" "+err);
      }
    });

    }

    if(this.isDoctor || this.isReceptionist){
      this.authService.getAllUsers().subscribe({
        next: (users) => {
          users.forEach((user: { Id: any; Name: any; Role:any }) => {
            if(user.Role=="Owner")
              this.petParents.push({ PetParentID: user.Id,
                PetParentName: user.Name});
             console.log("success getting all parents "+users);
          });
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
      });
    }
    window.location.reload();
  }// end of oninit

  // modal popup code for submission
  openModal() {
    // alert("here");
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
    this.generalPetIssues = this.generalPetIssues.filter(gpi=>gpi.IssueName!==petIssue);
    this.filteredpetIssues = [];
    let tempPetIssue:PetIssue ={
      PetIssueID: 0,
      IssueName: petIssue,
    }
    this.appointmentDetail.PetIssues.push(tempPetIssue);
  }
  onDisSelectPetIssue(Pi:PetIssue) {
    this.appointmentDetail.PetIssues = this.appointmentDetail.PetIssues.filter(pi=>pi.IssueName!==Pi.IssueName);

    this.generalPetIssues.push({
      GeneralPetIssueID: 0,
      IssueName: Pi.IssueName
    });
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
    this.appointmentDetail.DoctorID = vid as unknown as string;
    
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
        this.slotStatuses[this.appointmentDetail.ScheduleTimeSlot]=false;
      },
      error: (err) => {
        console.log("error occured while fetching the slots bool array", err);
      }
    });
  }

  isDisabled(index: number):boolean {
    // console.log("index = "+index+" obj index = "+this.appointmentDetail.ScheduleTimeSlot);
    
    if(index===this.appointmentDetail.ScheduleTimeSlot){
      return true;
    }
    return this.slotStatuses[index];
  }

  onSlotClick(slot: string, index: number,): void {
    if (!this.isDisabled(index)) {
      // console.log('Slot selected:', slot);
      console.log('selected slot index', index);
      this.selectedSlotIndex = index;
      this.appointmentDetail.ScheduleTimeSlot = index;
    }
  }

  isSelected(index: number): boolean {
    // this.appointmentDetail.ScheduleTimeSlot = index;
    return index === this.selectedSlotIndex;
  }
  filterPetParents():void {
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
    this.petService.GetPetsByParentID(ppid).subscribe({
      next:(data)=>{
        this.pets = data;
        console.log("success fetching all the pets of the owner "+ppname + " pets = "+data);
      },
      error:(err)=>{
        console.log("error occured while fetching the pets of owner + "+ppid+ " -- "+err);
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

  onBookEditBooking(reasonforvisit: string) {
    this.appointmentDetail.BookingDate = new Date();
    this.appointmentDetail.ReasonForVisit = reasonforvisit;
    this.appointmentDetail.Status = Status.Pending;
    this.appointmentDetail.Report = null;
    this.appointmentDetail.ScheduleTimeSlot=this.selectedSlotIndex!;
    if(this.isOwner)
    this.appointmentDetail.OwnerID = this.authService.getUIDFromToken();
    if(this.isDoctor){
      this.vetService.getVetsByNPINumber(this.authService.getVPIFromToken()).subscribe({
        next:(data)=>{
          this.appointmentDetail.DoctorID = data.VetId.toString();
          console.log("doctor id assigned success");
        },
        error:(err)=>{
          console.log("error occured while getting vet"+err);
        }
      });
    }
    // alert("inside booking");
    // finally call the service post method.

    // console.log("printing before putting "+ this.appointmentDetail);
    // console.log("appointment id = "+this.appointmentDetail.AppointmentID);
    // console.log("docid= "+this.appointmentDetail.DoctorID);
    // console.log("ownerid = "+this.appointmentDetail.OwnerID);
    // console.log("petid = "+this.appointmentDetail.PetID);
    // console.log(this.appointmentDetail.BookingDate);
    // console.log(this.appointmentDetail.ScheduleTimeSlot);
    // console.log(this.appointmentDetail.PetIssues);
    // console.log(this.appointmentDetail.Report);
    
    this.aptService.putAppointmentByIdandObj(this.appointmentDetail.AppointmentID,this.appointmentDetail).subscribe({
      next:(data)=>{
        let editedAppointment = data;
        console.log("edit success --- "+editedAppointment);
      },
      error:(err)=>{
        console.log("errooor occured while sending put request",err);
      }
    });
    // alert("edit success");
    // alert("edit success");
    this.closeModal();
    this.GoBackWithMsg("your appointment edited successfully");

  }

  isSubmitDisabled: boolean = true;

  toggleDisabled(): void {
    this.isSubmitDisabled = !this.isSubmitDisabled;
  }
}
