import { Component, Input } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../services/feedback.service';
import { Feedback, FeedbackQuestion } from '../../../models/appoitment-models/IFeedback';

@Component({
  selector: 'app-pet-appointment-card',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterOutlet, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './pet-appointment-card.component.html',
  styleUrl: './pet-appointment-card.component.css'
})
export class PetAppointmentCardComponent {
  openPopup(arg0: string) {
    // alert("This service will be available soon")
    this.snackBar.open(`${arg0} service will be available soon`, "Close", {
      verticalPosition: 'bottom'
    })
  }
  @Input()
  appointmentcard!: AppointmentCardDto;
  @Input()
  user!:string;

  constructor(private snackBar: MatSnackBar, private service :FeedbackService){}
  feedbackDetails: any[]=[];
  feedbackquestions!: FeedbackQuestion[];
  viewFeedbackfor!:number;
  feedback:Feedback={
    FeedbackID: 0,
    Questions: [],
    Recommendation: '',
    Comments: '',
    AppointmentId: 0
  }
  feedbacklist: Feedback[] = [];
  feedbackClicked(appointmentId: number) {
    const fb=this.feedbacklist.find(f=>f.AppointmentId==appointmentId)
  if(fb){
    this.feedback=fb;
  }
  
  this.feedbackDetails = this.feedback.Questions.map(question => {
    const feedbackQuestion = this.feedbackquestions.find(q => q.FeedbackQuestionId === question.FeedbackQuestionId);
    return {
      QuestionName: feedbackQuestion ? feedbackQuestion.FeedbackQuestionName : 'Unknown Question',
      Rating: question.Rating
    };
  });
  console.log(this.feedback)
  console.log(appointmentId);
  }
  ngOnInit(): void {
    this.service.getAllFeedback().subscribe((q:Feedback[])=>{
      this.feedbacklist=q;
    })
    this.service.getQuestions().subscribe((q:FeedbackQuestion[])=>{
      this.feedbackquestions=q
    
    });
  }
  openFeedbackPopup(action: string, appointmentId: number) {
    if (action === 'feedback') {
      this.feedback.AppointmentId = appointmentId; // Set the appointmentId for feedback
    }
  }
}
