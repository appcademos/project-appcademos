import { Component, OnInit } from '@angular/core';
import { AcademySessionService } from '../../../services/academySession.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements OnInit
{
    isLogin = true;
    email: String;
    name: String;
    location: String;
    password: String;
    phone: Number;

    constructor(private router: Router, public academyService: AcademySessionService) {}

    ngOnInit()
    {
        this.academyService.getAcademy()
        .subscribe
        (
            () =>
            {
                if (this.academyService.academy != null)
                {
                    this.router.navigate(["/academyprofile"]);
                }
            }
        );
    }

    login()
    {
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
