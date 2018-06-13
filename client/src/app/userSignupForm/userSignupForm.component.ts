import { Component, OnInit } from "@angular/core";
import { UserSessionService } from "../../services/userSession.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-userSignupForm",
  templateUrl: "./userSignupForm.component.html",
  styleUrls: ["./userSignupForm.component.scss"]
})
export class UserSignupFormComponent implements OnInit {
  isLogin: Boolean = true;
  email: String;
  password: String;
  instauser: String;
  preferences: String;
  name: String;

  constructor(private router: Router, public userService: UserSessionService) {}

  ngOnInit() {
    if (this.userService.user) {
      this.router.navigate(["/user"]);
    }
  }

  login() {
    const user = {
      username: this.email,
      password: this.password
    };
    this.userService.login(user).subscribe(user => {
      if (user) {
        this.router.navigate(["/user"]);
      }
    });
  }

  signup() {
    const user = {
      email: this.email,
      instauser: this.instauser,
      password: this.password,
      preferences: this.preferences,
      name: this.name
    };
    this.userService.signup(user).subscribe(user => {
      if (user) {
        this.router.navigate(["/user"]);
      }
    });
  }
}
