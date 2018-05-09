import { Component, OnInit } from '@angular/core';
import { AcademySessionService } from '../../services/academySession.service';

@Component({
  selector: 'app-academyLoginForm',
  templateUrl: './academyLoginForm.component.html',
  styleUrls: ['./academyLoginForm.component.scss']
})
export class AcademyLoginFormComponent implements OnInit {
  email: String;
  name: String;
  password: String;
  constructor(public academyService: AcademySessionService) { }

  ngOnInit() {
  }
  login() {
    const academy = {
      username: this.email,
      name: this.name,
      password: this.password
    };
    this.academyService.login(academy);
  }
}
