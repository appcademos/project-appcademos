import { Component, OnInit } from "@angular/core";
import { UserSessionService } from "../../services/userSession.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-userSignupForm",
  templateUrl: "./userSignupForm.component.html",
  styleUrls: ["./userSignupForm.component.scss"]
})
export class UserSignupFormComponent implements OnInit {
  isLogin: Boolean = false;
  email: String;
  password: String;

  constructor(private router: Router, public userService: UserSessionService) {
    
  }

  ngOnInit() {
    console.log(this.userService.user)
    if(this.userService.user){
      this.router.navigate(["/user"]);
    }
  }

  login() {
    const user = {
      username: this.email,
      password: this.password
    };
    this.userService.login(user).subscribe(user => console.log(user));
  }
  
  signup() {
    const user = {
      email: this.email,
      password: this.password
    };
    this.userService.signup(user).subscribe(user => {
      if(user){
        this.router.navigate(["/user"]);
      }
      console.log(user)});
  }
}
