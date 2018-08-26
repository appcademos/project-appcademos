import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import {AcademySessionService} from '../../services/academySession.service'
import { Router } from "@angular/router";

@Component({
  selector: 'app-createCourseForm',
  templateUrl: './createCourseForm.component.html',
  styleUrls: ['./createCourseForm.component.scss']
})
export class CreateCourseFormComponent implements OnInit {

  constructor( private academyService: AcademySessionService, private courseService: CoursesService) { }
  price: Number;
  title: {
    type: String,
    required: true
  };
  hours: Number;
  startDate: Date;
  sizeClass: Number;
  description: String;
  tags: [String];
  ngOnInit() {}

}
// createCourse(){
// const course = {
// price: this.price,
// title: this.title,
// hours: this.hours,
// startDate: this.startDate,
// sizeClass: this.sizeClass,
// description: this.description,
// tags: this.tags
// }

// this.courseService.createCourse(course).subscribe
// };