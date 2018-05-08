import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../services/userSession.service';


@Component({
  selector: 'app-userForm',
  templateUrl: './userForm.component.html',
  styleUrls: ['./userForm.component.scss']
})
export class UserFormComponent implements OnInit {

  email: String;
  password: String;

  constructor(public userService: UserSessionService) { }

  ngOnInit() {
  }

  signup() {
    const user = {
      email: this.email,
      password: this.password
    };
    this.userService.signup(user);
  }
}
