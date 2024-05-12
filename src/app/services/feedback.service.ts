import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback, Question, FeedbackQuestion, DoctorRating } from '../models/appoitment-models/IFeedback';
import { appointmentServiceUrl } from '../Shared/apiUrls';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  selectedid:number=0;
  selectedviewid:number=0;
constructor(private http:HttpClient){}
getData(id:number): Observable<Feedback> {
  
  return this.http.get<Feedback>(appointmentServiceUrl+"api/Feedback/${id}");
}
postData(obj:Feedback):Observable<Feedback>{
  console.log("Done");
  return this.http.post<Feedback>(appointmentServiceUrl+"api/Feedback",obj);
  
}
getQuestions():Observable<FeedbackQuestion[]>{
  return this.http.get<FeedbackQuestion[]>(appointmentServiceUrl+"api/FeedbackQuestions");
}
getAllFeedback():Observable<Feedback[]>{
  return this.http.get<Feedback[]>(appointmentServiceUrl+"api/Feedback");
}
PostAvgRating(obj:DoctorRating):Observable<DoctorRating>{
  return this.http.post<DoctorRating>("",obj);
}
getAvgRating():Observable<DoctorRating[]>{
  return this.http.get<DoctorRating[]>("");
}


// getQuestionsRating(obj:FeedbackQuestion[]):Question[]{
  
//   const questions: Question[] = [
//     { QuestionId: 1, FeedbackQuestionId: 0, Rating: 0 },
//     { QuestionId: 2, FeedbackQuestionId: 0, Rating: 0 },
//     { QuestionId: 3, FeedbackQuestionId: 0, Rating: 0 }
// ];
// for (let i = 0; i < questions.length; i++) {
//   questions[i].FeedbackQuestionId = obj[i].FeedbackQuestionId;
// }
// return questions;
// }
}