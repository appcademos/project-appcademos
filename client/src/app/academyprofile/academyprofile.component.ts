import { Component, OnInit } from '@angular/core';
import {AcademySessionService} from '../../services/academySession.service'
@Component({
  selector: 'app-academyprofile',
  templateUrl: './academyprofile.component.html',
  styleUrls: ['./academyprofile.component.scss']
})
export class AcademyprofileComponent implements OnInit {

  constructor(public academyService: AcademySessionService) { }

  ngOnInit() {
  }

}


