import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  ViewChild
} from "@angular/core";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import { FormControl } from "@angular/forms";
import { environment } from "../../environments/environment";
import { GeolocationService } from "../../services/geolocation.service";
import { MapMarkersService } from "../../services/map-markers.service";

//interface for marker
interface marker {
  lat: number;
  lng: number;
  label?: string;
  content?: string;
  draggable: boolean;
}

@Component({
  selector: "app-map-searchbox",
  templateUrl: "./map-searchbox.component.html",
  styleUrls: ["./map-searchbox.component.scss"]
})
export class MapSearchboxComponent implements OnInit {
  searchLatitude: number;
  searchLongitude: number;
  zoom: number;

  markers: marker[] = [];

  @ViewChild("search") public searchElementRef: ElementRef;
  public searchControl: FormControl;

  constructor(
    private geoquest: GeolocationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private markerService: MapMarkersService
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
          this.markerService.zoom = 12;

          console.log(this.searchLatitude, this.searchLongitude);
          
          this.markerService.academyMarker = {
            lat: this.searchLatitude,
            lng: this.searchLongitude,
            draggable: false
          };
        });
      });
    });
    // Create Search FormControl
    this.searchControl = new FormControl();
  }
}
