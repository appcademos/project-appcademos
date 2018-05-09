import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../services/request.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../../sass/components/user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(public request: RequestService) {}

  ngOnInit() {
  }

}
