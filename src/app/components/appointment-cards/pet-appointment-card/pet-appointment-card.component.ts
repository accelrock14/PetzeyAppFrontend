import { Component, Input, SimpleChanges } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../services/feedback.service';
import { DoctorRating, Feedback, FeedbackQuestion, Question } from '../../../models/appoitment-models/IFeedback';
import { EllipsisPipe } from '../../../pipes/Ellipsis/ellipsis.pipe';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FirstNamePipe } from '../../../pipes/FirstName/first-name.pipe';
import { AppointmentDetail } from '../../../models/AppointmentDetail';

@Component({
  selector: 'app-pet-appointment-card',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterOutlet, RouterLinkActive, FormsModule, CommonModule, EllipsisPipe, FirstNamePipe],
  templateUrl: './pet-appointment-card.component.html',
  styleUrl: './pet-appointment-card.component.css'
})
export class PetAppointmentCardComponent {
  getStatusColor(status: string): string {
    switch (status) {
        case 'Pending':
            return 'darkgoldenrod';
        case 'Closed':
            return 'grey';
        case 'Cancelled':
            return 'red';
        case 'Confirmed':
            return 'green';
        default:
            return 'black'; // Or any default color
    }
}

  openPopup(arg0: string) {
    this.snackBar.open(`${arg0} service will be available soon`, "Close", {
      verticalPosition: 'bottom'
    })
  }
  @Input()
  appointmentcard!: AppointmentCardDto;
  @Input()
  user!:string;

  constructor(private snackBar: MatSnackBar, private service :FeedbackService,private authservice:AuthService,private toastservice:ToastrService){}
//from this new code is added

  selectedappointmentid:number=0;
  showmodal:boolean=false;
feedbacklist:Feedback[]=[];
appointment:AppointmentDetail={
  AppointmentID: 0,
  DoctorID: '',
  PetID: 0,
  OwnerID: '',
  ScheduleDate: new Date(),
  ScheduleTimeSlot: 0,
  BookingDate: new Date(),
  ReasonForVisit: '',
  Status: 0,
  Report: null,
  PetIssues: []
}
doctorRating:DoctorRating={
  DoctorRatingId: 0,
  DoctorId: "",
  AppointmentId: 0,
  AvgRating: 0
}
  role:string="";
  clicked(obj: number,status:string) {
    this.service.selectedid=obj;
    this.selectedappointmentid=obj;
    this.showmodal=false;
    if(status=="Cancelled"||status=="Pending"||status=="Confirmed"){
      this.toastservice.info("Feedback can be submitted only if appointment is closed")
    }
    else if(!this.feedbacklist.find(f=>f.AppointmentId==obj)&& status=="Closed"){
      this.showmodal=true;
   
    }
    else{
      this.showmodal=false;
      this.toastservice.info("Feedback can be submitted only once")
    }
   
 }
   
     feedbackForm: any;
   
    
     feedbackquestions!: FeedbackQuestion[];
       
      
     
     questions:Question[]=[];
       ngOnInit(): void {
       this.service.getQuestions().subscribe((q:FeedbackQuestion[])=>{
         this.feedbackquestions=q;
         this.feedback.Questions = this.feedbackquestions.map(question => ({
           QuestionId:0,
           FeedbackQuestionId: question.FeedbackQuestionId,
           Rating: 0
         }));
       })
       this.role=this.authservice.getRoleFromToken();
       
      //  this.feedback.Questions = this.feedbackquestions.map(question => ({
      //        QuestionId:0,
      //        FeedbackQuestionId: question.FeedbackQuestionId,
      //        Rating: 0
      //      }));
      this.service.getAllFeedback().subscribe((f)=>{
        this.feedbacklist=f;
       })

      
       }
     
       
     
     
       onSubmit(appointmentId: number) {
        
        // Wait for update
        const feedbackToSubmit: Feedback = { ...this.feedback };
        feedbackToSubmit.AppointmentId = this.service.selectedid;
       console.log(this.selectedappointmentid)
         this.service.postData(feedbackToSubmit).subscribe(
           (response) => {
            this.toastservice.success("Feedback  submitted successfully")
             console.log('Response:', response);
             
           },
           (error) => {
            this.toastservice.error("Feedback not submitted");
             console.error('Error:', error);
             // Handle error
           }
         );
         this.feedback.Questions = this.feedbackquestions.map(question => ({
          QuestionId:0,
          FeedbackQuestionId: question.FeedbackQuestionId,
          Rating: 0
        }));
       this.feedback.Comments='';
       this.feedback.Recommendation='';
       this.showmodal=false;
 
       this.service.getAllFeedback().subscribe((f)=>{
              this.feedbacklist=f;
             })
             this.doctorRating.DoctorId=this.appointmentcard.DoctorID;
             this.doctorRating.AppointmentId=this.service.selectedid;
             feedbackToSubmit.Questions.forEach(element => {
               this.doctorRating.AvgRating+=element.Rating;
             });
             this.doctorRating.AvgRating=this.doctorRating.AvgRating/feedbackToSubmit.Questions.length;
            
                 this.service.PostAvgRating(this.doctorRating).subscribe((p)=>{
       
                 })
                 window.location.reload();
         
         }
         
           feedback: Feedback={
             FeedbackID: 0,
             Questions: [],
             Recommendation: '',
             Comments: '',
             AppointmentId: 0,
           }
           
         
           
         
           setRating(questionId: number, rating: number) {
             const questionIndex = this.feedback.Questions.findIndex(q => q.FeedbackQuestionId === questionId);
             if (questionIndex !== -1) {
               this.feedback.Questions[questionIndex].Rating = rating;
             }
           }
          
           // isFormValid(): boolean {
           //   return this.feedback.Competence !== 0 &&
           //          this.feedback.Outcome !== 0 &&
           //          this.feedback.Booking !== 0
                   
           // }
           isFilled(rating: number, id: number): boolean {
             const foundQuestion = this.feedback.Questions.find(q => q.FeedbackQuestionId === id);
             return foundQuestion ? foundQuestion.Rating >= rating : false;
           }
           isFormValid(): boolean {
             // Check if all questions have been rated
             return this.feedback.Questions.every(q => q.Rating !== 0);
           }
           close() {
            this.feedback.Questions = this.feedbackquestions.map(question => ({
              QuestionId:0,
              FeedbackQuestionId: question.FeedbackQuestionId,
              Rating: 0
            }));
           this.feedback.Comments='';
           this.feedback.Recommendation='';
           this.showmodal=false;
            }

          }


  //   feedbackDetails: any[]=[];
//   feedbackquestions!: FeedbackQuestion[];
//   viewFeedbackfor!:number;
//   feedback:Feedback={
//     FeedbackID: 0,
//     Questions: [],
//     Recommendation: '',
//     Comments: '',
//     AppointmentId: 0
//   }
//   feedbacklist: Feedback[] = [];
//   feedbackClicked(appointmentId: number) {
//   //   console.log("done --")
//   //  console.log(appointmentId)
//     const fb=this.feedbacklist.find(f=>f.AppointmentId===appointmentId)
    
//   if(fb){
//     this.feedback=fb;
//   }
//   // console.log(this.feedback)
//   this.feedbackDetails = this.feedback.Questions.map(question => {
//     const feedbackQuestion = this.feedbackquestions.find(q => q.FeedbackQuestionId === question.FeedbackQuestionId);
    
//     return {
     
//       QuestionName: feedbackQuestion ? feedbackQuestion.FeedbackQuestionName : 'Unknown Question',
//       Rating: question.Rating
//     };
//   });
//   console.log(this.feedback)
  



  
// }

//   ngOnInit(): void {
//     this.service.getAllFeedback().subscribe((q:Feedback[])=>{
//       this.feedbacklist=q;
//       console.log(this.feedbacklist)
//     })
//     this.service.getQuestions().subscribe((q:FeedbackQuestion[])=>{
//       this.feedbackquestions=q
    
//     });
//   }
  

