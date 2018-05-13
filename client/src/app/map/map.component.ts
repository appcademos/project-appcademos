import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  ViewChild
} from "@angular/core";
import {} from "googlemaps";
import { Http } from "@angular/http";
// import { MapsAPILoader } from "@agm/core";
import { Observable } from "rxjs/Observable";
// import { FormControl } from "@angular/forms";
import { environment } from "../../environments/environment";
import { GeolocationService } from "../../services/geolocation.service";
import { MapMarkersService } from "../../services/map-markers.service";


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

  options: any = { withCredentials: true };

  constructor(private http: Http, private geoquest: GeolocationService, private markerService: MapMarkersService) {}

  ngOnInit() {
    this.setCurrentPosition();

    return this.http
      .get(`${environment.BASEURL}/api/academy/all`, this.options)
      .map(res => res.json())
      .subscribe(res => {
        if (res.academies) {
          res.academies.forEach(elem => {

            this.markerService.markers.push({
              lat: elem.location.coordinates[0],
              lng: elem.location.coordinates[1],
              draggable: false
            });
          });
        }
      });
  }

  private setCurrentPosition() {
    this.geoquest.getLocation().subscribe(userLocation => {
      this.currentPos.lat = userLocation.latitude;
      this.currentPos.lng = userLocation.longitude;
      this.markerService.markers.push({
        content: "Current Position",
        lat: this.currentPos.lat,
        lng: this.currentPos.lng,
        draggable: false
      });
    });
  }
}
