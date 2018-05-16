import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../services/userSession.service';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  
  email: String;
  password: String;
  viewCourse: any;
  
  constructor(private userservice: UserSessionService, private courseservice: CoursesService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params.course);
      if (params.course) {
        this.courseservice.getCourse(params.course).subscribe(res => {
          this.viewCourse = res.course;
        });
      }
    });
  }
  signup() {
    const user = {
      email: this.email,
      password: this.password
    };
    this.userservice.signup(user).subscribe();
  }
}
