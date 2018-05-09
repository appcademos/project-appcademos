import { Component, OnInit } from "@angular/core";
import { RequestService } from "../../services/request.service";
import { ViewChild } from "@angular/core";
import {} from "@types/googlemaps";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {

  @ViewChild("gmap") gmapElement: any;
  map: google.maps.Map;

  academyList: Array<any> = [];

  constructor(public request: RequestService) {}

  ngOnInit() {
    this.getAllAcademies();

    let mapProp = {
      center: { lat: 40.3923599, lng: -3.6985403 },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map   (this.gmapElement.nativeElement, mapProp);

    var userMarker = new google.maps.Marker({
      map: this.map,
      position: mapProp.center,
      title: 'Cerdo de mierda'
    });
  }

  getAllAcademies() {
    this.request.get("/api/academy/all").subscribe(list => {
      console.log(list);
      this.academyList = list;
    });
  }
}
