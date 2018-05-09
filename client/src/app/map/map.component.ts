import { Component, OnInit } from "@angular/core";
import { RequestService } from "../../services/request.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["../../sass/components/map.component.scss"]
})
export class MapComponent implements OnInit {

  academyList: Array<any> = [];

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(public request: RequestService) {}

  ngOnInit() {
    this.request.get("/api/academy/all").subscribe(list => {
      this.academyList = list;
      console.log(list);
    });
  }
}
