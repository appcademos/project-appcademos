import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-displaySearchedCourses',
  templateUrl: './displaySearchedCourses.component.html',
  styleUrls: ['./displaySearchedCourses.component.scss']
})
export class DisplaySearchedCoursesComponent implements OnInit {

  constructor(private courseService: CoursesService) { }

  ngOnInit() {
  }

}
