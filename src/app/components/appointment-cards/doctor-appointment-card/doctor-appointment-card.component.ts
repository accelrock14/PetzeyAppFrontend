import { Component, Input } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private snackBar: MatSnackBar){}

//   feedbackDetails: any[]=[];
//   constructor(private service :FeedbackService){}
//   feedbackquestions!: FeedbackQuestion[];
//   feedback:Feedback={
//     FeedbackID: 0,
//     Questions: [],
//     Recommendation: '',
//     Comments: '',
//     AppointmentId: 0
//   }
// ngOnInit(): void {
//   this.service.getData(2).subscribe(
//     (response) => {
//       this.feedback = response;
//     },
//     (error) => {
//       console.error('Error:', error);
//       // Handle error
//     }
//   );
//   this.service.getQuestions().subscribe((q:FeedbackQuestion[])=>{
//     this.feedbackquestions=q
//     this.feedbackDetails = this.feedback.Questions.map(question => {
//       const feedbackQuestion = this.feedbackquestions.find(q => q.FeedbackQuestionId === question.FeedbackQuestionId);
//       return {
//         QuestionName: feedbackQuestion ? feedbackQuestion.FeedbackQuestionName : 'Unknown Question',
//         Rating: question.Rating
//       };
//     });
//   });
// }


}
