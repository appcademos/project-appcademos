import { Component, OnInit } from "@angular/core";
import { UserSessionService } from "../../services/userSession.service";

@Component({
  selector: 'app-userSignupForm',
  templateUrl: './userSignupForm.component.html',
  styleUrls: ['./userSignupForm.component.scss']
})
export class UserSignupFormComponent implements OnInit {
  isLogin: Boolean = false;
  email: String;
  password: String;

  constructor(public userService: UserSessionService) {}

  ngOnInit() {}

  login() {
    const user = {
      username: this.email,
      password: this.password
    };
    this.userService.login(user);
  }
}
