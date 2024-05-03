import { Component, Input, SimpleChanges } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../services/feedback.service';
import { Feedback, FeedbackQuestion, Question } from '../../../models/appoitment-models/IFeedback';
import { EllipsisPipe } from '../../../pipes/Ellipsis/ellipsis.pipe';
import { AuthService } from '../../../services/UserAuthServices/auth.service';

@Component({
  selector: 'app-pet-appointment-card',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterOutlet, RouterLinkActive, FormsModule, CommonModule, EllipsisPipe],
  templateUrl: './pet-appointment-card.component.html',
  styleUrl: './pet-appointment-card.component.css'
})
export class PetAppointmentCardComponent {
  openPopup(arg0: string) {
    this.snackBar.open(`${arg0} service will be available soon`, "Close", {
      verticalPosition: 'bottom'
    })
  }
  @Input()
  appointmentcard!: AppointmentCardDto;
  @Input()
  user!:string;

  constructor(private snackBar: MatSnackBar, private service :FeedbackService,private authservice:AuthService){}
  selectedappointmentid:number=0;
  role:string="";
  clicked(obj: number) {
    this.service.selectedid=obj;
    this.selectedappointmentid=obj;
    console.log(this.selectedappointmentid)
   
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
      
       }
     
       
     
     
       onSubmit(appointmentId: number) {
        
        // Wait for update
        const feedbackToSubmit: Feedback = { ...this.feedback };
        feedbackToSubmit.AppointmentId = this.service.selectedid;
       console.log(this.selectedappointmentid)
         this.service.postData(feedbackToSubmit).subscribe(
           (response) => {
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
          
          

}

