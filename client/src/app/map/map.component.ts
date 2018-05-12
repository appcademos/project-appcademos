import { Component, OnInit } from "@angular/core";
import { RequestService } from "../../services/request.service";
import { GeolocationService } from "../../services/geolocation.service";

//interface for marker
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})

export class MapComponent implements OnInit {

  academyList: Array<any> = [];
  userLocation = {
    lat: 40.3994275,
    lng: -3.7030302
  }
  zoom: number = 15;
  markers: marker[] = [];
  radius: number = 1000; // In meters

  constructor(public request: RequestService, public geoquest: GeolocationService) { }

  ngOnInit() {
/*     this.request.get("/api/academy/all").subscribe(list => {

      this.geoquest.getLocation().subscribe(userLocation => {
        this.userLocation.lat = userLocation.latitude;
        this.userLocation.lng = userLocation.longitude;
        this.markers.push({ lat: this.userLocation.lat, lng: this.userLocation.lng, draggable: false })
      });
      this.academyList = list.academies;
      if (this.academyList) {
        this.academyList.forEach(elem => {
          this.geoquest.getDistance
          this.markers.push({ lat: elem.location.coordinates[0], lng: elem.location.coordinates[1], draggable: false })
        })
      }
    }); */
  }
}

/* import { Component, OnInit } from "@angular/core";
import { GeolocationService } from "../../services/geolocation.service";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../../environments/environment.prod";

//interface for marker
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})

export class MapComponent implements OnInit {

  academyList: Array<any> = [];
  userLocation = {
    lat: 40.3994275,
    lng: -3.7030302
  }
  zoom: number = 15;
  markers: marker[] = [];
  radius: number = 1000; // In meters

  constructor(public http: Http, public geoquest: GeolocationService) { }

  ngOnInit() {
    this.http.get(`${environment.BASEURL}/api/academy/all`).map(list => {

      this.geoquest.getLocation().subscribe(userLocation => {
        this.userLocation.lat = userLocation.latitude;
        this.userLocation.lng = userLocation.longitude;
        this.markers.push({ lat: this.userLocation.lat, lng: this.userLocation.lng, draggable: false })
      });
      this.academyList = list.academies;
      if (this.academyList) {
        this.academyList.forEach(elem => {
          this.geoquest.getDistance
          this.markers.push({ lat: elem.location.coordinates[0], lng: elem.location.coordinates[1], draggable: false })
        })
      }
    });
  }
}
 */