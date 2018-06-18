import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  ViewChild
} from "@angular/core";
import {} from "googlemaps";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../environments/environment";
import { GeolocationService } from "../../services/geolocation.service";
import { MapMarkersService } from "../../services/map-markers.service";
import { CoursesService } from "../../services/courses.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  currentPos = {
    lat: 40.3994275,
    lng: -3.7030302
  };
  searchedCourses: Array<any> = [];

  options: any = { withCredentials: true };

  constructor(
    private http: Http,
    private geoquest: GeolocationService,
    private markerService: MapMarkersService,
    private courseService: CoursesService
  ) {}

  ngOnInit() {
    this.markerService.markers = [];
    this.setCurrentPosition();
  }

  private setCurrentPosition() {
    this.geoquest.getLocation().subscribe(userLocation => {
      this.currentPos.lat = userLocation.latitude;
      this.currentPos.lng = userLocation.longitude;
      this.markerService.userLoc = {
        content: "Tu posición",
        lat: this.currentPos.lat,
        lng: this.currentPos.lng,
        draggable: false
      };
    });
    return;
  }
}