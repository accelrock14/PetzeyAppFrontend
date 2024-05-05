import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback, Question, FeedbackQuestion } from '../models/appoitment-models/IFeedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  selectedid:number=0;
  selectedviewid:number=0;
constructor(private http:HttpClient){}
getData(id:number): Observable<Feedback> {
  
  return this.http.get<Feedback>(`https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Feedback/${id}`);
}
postData(obj:Feedback):Observable<Feedback>{
  console.log("Done");
  return this.http.post<Feedback>("https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Feedback",obj);
  
}
getQuestions():Observable<FeedbackQuestion[]>{
  return this.http.get<FeedbackQuestion[]>("https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/FeedbackQuestions");
}
getAllFeedback():Observable<Feedback[]>{
  return this.http.get<Feedback[]>("https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Feedback");
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