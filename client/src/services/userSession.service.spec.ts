/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserSessionService } from './userSession.service';

describe('Service: UserSession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSessionService]
    });
  });

  it('should ...', inject([UserSessionService], (service: UserSessionService) => {
    expect(service).toBeTruthy();
  }));
});
