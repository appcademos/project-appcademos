import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../../environments/environment";
import { CoursesService } from '../../services/courses.service';



@Component({
  selector: 'app-searchbox-courses',
  templateUrl: './searchbox-courses.component.html',
  styleUrls: ['./searchbox-courses.component.scss']
})
export class SearchboxCoursesComponent implements OnInit {
  options: any = { withCredentials: true };
  constructor(private courses: CoursesService) { }
  searchcourses: String;
  ngOnInit() {
  }
  findCourses() {
    console.log("searchbox called");
    this.searchcourses = this.searchcourses.toLowerCase();
    this.courses.findCourses(this.searchcourses).subscribe();
  }
}
