import { Component, OnInit } from '@angular/core';
import { AcademySessionService } from '../../services/academySession.service';

@Component({
  selector: 'app-academySignupForm',
  templateUrl: './academySignupForm.component.html',
  styleUrls: ['./academySignupForm.component.scss']
})
export class AcademySignupFormComponent implements OnInit {

  constructor(public academyService: AcademySessionService) { }
email: String;
name: String;
location: String;
password: String;
phone: Number;

  ngOnInit() {
  }
  login() {
    const academy = {
      username: this.email,
      password: this.password
    };
    this.academyService.login(academy);
  }

  signup(){
    const academy={
      email: this.email,
      password: this.password,
      name: this.name,
      location: this.location,
      phone: this.phone
    };
    this.academyService.signup(academy);
  }
}
