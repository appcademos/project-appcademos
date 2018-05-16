import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';


@Component({
  selector: 'app-allCourses',
  templateUrl: './allCourses.component.html',
  styleUrls: ['./allCourses.component.scss']
})
export class AllCoursesComponent implements OnInit {

  constructor(private courseService: CoursesService) {
    this.courseService.searching = true;
  }

  ngOnInit() {
  }

}
