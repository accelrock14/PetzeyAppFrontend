// export interface FeedBack{
//  FeedbackID:number
//  Competence:number,
//  Outcome:number,
//  Booking:number,
//  Recommendation:'Yes' | 'No'|'PreferNotToSay',
//  Comments:string
//     AppointmentId:number,
// }

export interface Feedback {
    FeedbackID: number;
    Questions: Question[];
    Recommendation: string;
    Comments: string;
    AppointmentId: number;
}
export interface Question {
    QuestionId: number;
    FeedbackQuestionId: number;
    Rating: number;
}
// export interface Ratings{
//     Competence:number,
//     Outcome:number,
//     Booking:number,
//     Recommendation:'Yes' | 'No'|'PreferNotToSay',
//     Comments:string
// }
export interface FeedbackQuestion{
    FeedbackQuestionId:number;
    FeedbackQuestionName:string;
}
export interface DoctorRating {
    DoctorRatingId: number;
    DoctorId: string;
    AppointmentId: number;
    AvgRating: number;
  }