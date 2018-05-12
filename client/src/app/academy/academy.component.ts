import { Component, OnInit } from '@angular/core';
import { AcademySessionService } from '../../services/academySession.service';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements OnInit {

  constructor(public academySession: AcademySessionService) { }

  ngOnInit() {
  }

}
