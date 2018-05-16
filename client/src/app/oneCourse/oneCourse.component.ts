import { Component, OnInit } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-oneCourse",
  templateUrl: "./oneCourse.component.html",
  styleUrls: ["./oneCourse.component.scss"]
})
export class OneCourseComponent implements OnInit {
  courseObj: any;
  average: number;
  constructor(
    private courseService: CoursesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.courseService.getCourse(params.id).subscribe(() => {
          this.courseObj = this.courseService.viewCourse;
          
        });
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
