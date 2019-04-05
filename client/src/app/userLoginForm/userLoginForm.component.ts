import { Component, OnInit } from "@angular/core";
import { UserSessionService } from "../../services/userSession.service";

@Component({
  selector: "app-userLoginForm",
  templateUrl: "./userLoginForm.component.html",
  styleUrls: ["./userLoginForm.component.scss"]
})
export class UserLoginFormComponent implements OnInit {

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

  signup() {}
}
