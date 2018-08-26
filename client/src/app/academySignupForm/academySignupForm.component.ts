import { Component, OnInit } from "@angular/core";
import { AcademySessionService } from "../../services/academySession.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-academySignupForm",
  templateUrl: "./academySignupForm.component.html",
  styleUrls: ["./academySignupForm.component.scss"]
})
export class AcademySignupFormComponent implements OnInit {
  constructor(private router: Router,public academyService: AcademySessionService) {}
  email: String;
  name: String;
  location: String;
  password: String;
  phone: Number;

  ngOnInit() {
    if (this.academyService.academy) {
      this.router.navigate(["/academy"]);
    }
  }
  
  login() {
    const academy = {
      username: this.email,
      password: this.password
    };
    this.academyService.login(academy).subscribe(academy=>{
      if(academy){
        this.router.navigate(["/academyprofile"]);
      }
    });
  }

  signup() {
    const academy = {
      email: this.email,
      password: this.password,
      name: this.name,
      location: this.location,
      phone: this.phone
    };
    this.academyService.signup(academy).subscribe(academy => {
      if (academy) {
        this.router.navigate(["/academyprofile"]);
      }
    });
  }
}
