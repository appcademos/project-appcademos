/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AcademySessionService } from './academySession.service';

describe('Service: AcademySession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcademySessionService]
    });
  });

  it('should ...', inject([AcademySessionService], (service: AcademySessionService) => {
    expect(service).toBeTruthy();
  }));
});
