import { Component, Input } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from '../../../services/feedback.service';
import { Feedback, FeedbackQuestion, Question } from '../../../models/appoitment-models/IFeedback';

@Component({
  selector: 'app-doctor-appointment-card',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, RouterLink],
  templateUrl: './doctor-appointment-card.component.html',
  styleUrl: './doctor-appointment-card.component.css'
})
export class DoctorAppointmentCardComponent {
openPopup(arg0: string) {
  // alert("This service will be available soon")
  this.snackBar.open(`${arg0} service will be available soon`, "Close", {
    verticalPosition: 'bottom'
  })
}
  @Input()
  appointmentcard!: AppointmentCardDto;

  constructor(private snackBar: MatSnackBar,  private service:FeedbackService){}


  clicked(obj: number) {
    this.feedback.AppointmentId = obj;
 }
   
     feedbackForm: any;
     competenceTouched: boolean=false;
    
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
       this.feedback.Questions = this.feedbackquestions.map(question => ({
             QuestionId:0,
             FeedbackQuestionId: question.FeedbackQuestionId,
             Rating: 0
           }));
       }
     
       
     
     
       onSubmit(appointmentId: number) {
        console.log(appointmentId);
        console.log(this.feedback.AppointmentId);
         this.service.postData(this.feedback).subscribe(
           (response) => {
             console.log('Response:', response);
             // Handle response as needed
           },
           (error) => {
             console.error('Error:', error);
             // Handle error
           }
         );
         console.log(this.feedback)
         
         }
         temp:string='hello';
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
