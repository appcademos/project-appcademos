import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  ViewChild
} from "@angular/core";
import {} from "googlemaps";
import { Http } from "@angular/http";
import { MapsAPILoader } from "@agm/core";
import { Observable } from "rxjs/Observable";
import { FormControl } from "@angular/forms";
import { environment } from "../../environments/environment";
import { GeolocationService } from "../../services/geolocation.service";

//interface for marker
interface marker {
  lat: number;
  lng: number;
  label?: string;
  content?: string;
  draggable: boolean;
}

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  searchLatitude: number;
  searchLongitude: number;

  currentPos = {
    lat: 40.3994275,
    lng: -3.7030302
  };
  zoom: number = 15;

  markers: marker[] = [];
  academyList: Array<any> = [];
  options: any = { withCredentials: true };

  @ViewChild("search") public searchElementRef: ElementRef;
  public searchControl: FormControl;

  constructor(
    private http: Http,
    private geoquest: GeolocationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ["address"]
        }
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // Get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // Verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // Set latitude, longitude and zoom
          this.searchLatitude = place.geometry.location.lat();
          this.searchLongitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

    // Create Search FormControl
    this.searchControl = new FormControl();
    // Set current user's position
    this.setCurrentPosition();

    return this.http
      .get(`${environment.BASEURL}/api/academy/all`, this.options)
      .map(res => res.json())
      .subscribe(res => {
        
        this.academyList = res.academies;
        if (this.academyList) {
          this.academyList.forEach(elem => {
            this.geoquest.getDistance;
            this.markers.push({
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
      this.markers.push({
        content: "Current Position",
        lat: this.currentPos.lat,
        lng: this.currentPos.lng,
        draggable: false
      });
    });
  }
}
