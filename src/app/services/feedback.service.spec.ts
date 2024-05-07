import { TestBed } from '@angular/core/testing';

import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Feedback, FeedbackQuestion } from '../models/appoitment-models/IFeedback';
import { appointmentServiceUrl } from '../Shared/apiUrls';




describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeedbackService]
    });
    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

 

  it('should post feedback data', () => {
    const testData: Feedback = {
      FeedbackID: 1,
      Questions: [],
      Recommendation: '',
      Comments: '',
      AppointmentId: 1
    };

    service.postData(testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const request = httpMock.expectOne(`${appointmentServiceUrl}api/Feedback`);
    expect(request.request.method).toBe('POST');
    request.flush(testData);
  });

  it('should get questions', () => {
    const testQuestions: FeedbackQuestion[] = [
      { FeedbackQuestionId: 1, FeedbackQuestionName: 'Question 1' },
      { FeedbackQuestionId: 2, FeedbackQuestionName: 'Question 2' }
    ];

    service.getQuestions().subscribe((questions) => {
      expect(questions).toEqual(testQuestions);
    });

    const request = httpMock.expectOne(`${appointmentServiceUrl}api/FeedbackQuestions`);
    expect(request.request.method).toBe('GET');
    request.flush(testQuestions);
  });

  it('should get all feedback', () => {
    const allFeedback: Feedback[] = [
      {
        FeedbackID: 1,
        Questions: [],
        Recommendation: '',
        Comments: '',
        AppointmentId: 1
      },
      {
        FeedbackID: 2,
        Questions: [],
        Recommendation: '',
        Comments: '',
        AppointmentId: 2
      }
    ];

    service.getAllFeedback().subscribe((feedback) => {
      expect(feedback).toEqual(allFeedback);
    });

    const request = httpMock.expectOne(`${appointmentServiceUrl}api/Feedback`);
    expect(request.request.method).toBe('GET');
    request.flush(allFeedback);
  });
});
