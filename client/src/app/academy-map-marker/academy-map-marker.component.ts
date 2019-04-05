import { Component, OnInit } from '@angular/core';
import { MapMarkersService } from '../../services/map-markers.service';

@Component({
  selector: 'app-academy-map-marker',
  templateUrl: './academy-map-marker.component.html',
  styleUrls: ['./academy-map-marker.component.scss']
})
export class AcademyMapMarkerComponent implements OnInit
{
    markerService: MapMarkersService;

  constructor(markerService: MapMarkersService) { }

  ngOnInit() {
  }

}
