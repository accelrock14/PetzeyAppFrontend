import { Component, Input } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from '../../../services/feedback.service';
import { Feedback, FeedbackQuestion, Question } from '../../../models/appoitment-models/IFeedback';
import { EllipsisPipe } from '../../../pipes/Ellipsis/ellipsis.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-appointment-card',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, RouterLink, EllipsisPipe],
  templateUrl: './doctor-appointment-card.component.html',
  styleUrl: './doctor-appointment-card.component.css'
})
export class DoctorAppointmentCardComponent {
openPopup(arg0: string) {
  this.snackBar.open(`${arg0} service will be available soon`, "Close", {
    verticalPosition: 'bottom'
  })
}
  @Input()
  appointmentcard!: AppointmentCardDto;
  @Input()
  user!:string;

  constructor(private snackBar: MatSnackBar,  private service:FeedbackService,private toastservice:ToastrService){}

selectedappointmentid:number=0;
showmodal:boolean=false;
feedbacklist:Feedback[]=[];
  clicked(obj: number) {
    this.service.selectedid=obj;
    this.selectedappointmentid=obj;
    console.log(this.selectedappointmentid);
    this.showmodal=false;
    if(!this.feedbacklist.find(f=>f.AppointmentId==obj)){
      this.showmodal=true;
   
    }
    else{
      this.showmodal=false;
      this.toastservice.info("feedback can be submitted only once");
    }
   
 }
   
     feedbackForm: any;
   
    
     feedbackquestions!: FeedbackQuestion[];
       
      
     
     questions:Question[]=[];
       ngOnInit(): void {
        console.log(this.appointmentcard.DoctorPhoto)
       this.service.getQuestions().subscribe((q:FeedbackQuestion[])=>{
         this.feedbackquestions=q;
         this.feedback.Questions = this.feedbackquestions.map(question => ({
           QuestionId:0,
           FeedbackQuestionId: question.FeedbackQuestionId,
           Rating: 0
         }));
       })
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
            this.toastservice.info("feedback can be submitted successfully");
             console.log('Response:', response);
             
           },
           (error) => {
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
