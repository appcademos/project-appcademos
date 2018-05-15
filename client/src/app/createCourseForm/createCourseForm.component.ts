import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-createCourseForm',
  templateUrl: './createCourseForm.component.html',
  styleUrls: ['./createCourseForm.component.scss']
})
export class CreateCourseFormComponent implements OnInit {

  constructor(private courseService: CoursesService) { }
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
  ngOnInit() {
  }

}
