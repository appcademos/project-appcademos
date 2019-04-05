import { Component, OnInit } from '@angular/core';
import { MapMarkersService } from '../../services/map-markers.service';

@Component({
  selector: 'app-courses-map-markers',
  templateUrl: './courses-map-markers.component.html',
  styleUrls: ['./courses-map-markers.component.scss']
})
export class CoursesMapMarkersComponent implements OnInit
{
    markerService: MapMarkersService;

  constructor(markerService: MapMarkersService) { }

  ngOnInit() {
  }

}
