/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapMarkersService } from './map-markers.service';

describe('Service: MapMarkers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapMarkersService]
    });
  });

  it('should ...', inject([MapMarkersService], (service: MapMarkersService) => {
    expect(service).toBeTruthy();
  }));
});
