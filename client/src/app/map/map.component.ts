import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  academyList: Array<any> = []

  constructor(public request: RequestService) { }

  ngOnInit() {
    this.request.get("/api/academy/all").subscribe(list => {
      console.log(list);
      this.academyList = list});


      



  }

  getAllAcademies() {}
    
}
