import { Component, OnInit } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-displaySearchedCourses",
  templateUrl: "./displaySearchedCourses.component.html",
  styleUrls: ["./displaySearchedCourses.component.scss"]
})
export class DisplaySearchedCoursesComponent implements OnInit {
  average: Number;
  stars: Array<any> = [];
  constructor(
    private courseService: CoursesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.course) {
        this.courseService.findCourses(params.course).subscribe();
      }
    });      
    }
  
    calcReviewGrade(reviews) {
      let average = 0;
      reviews.forEach(review => {
        average += review.grade;
      });
      this.average = average / reviews.length;  
      return this.average;
    }

  

}
