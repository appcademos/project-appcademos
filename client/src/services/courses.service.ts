import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";

@Injectable()
export class CoursesService {
  options: any = { withCredentials: true };
  searchcourses: String;
  foundCourses: Array<any> = [];
  searching: Boolean = true;
  viewCourse: any;

  constructor(private http: Http, private router: Router) {}
  findCourses(searchcourses) {
    this.searchcourses = searchcourses.replace(/[\s]/g, "+");

    return this.http
      .get(
        `${environment.BASEURL}/api/course/search?course=${this.searchcourses}`,
        this.options
      )
      .map(res => res.json())
      .map(courses => {
        this.searching = false;
        if (courses) {
          this.router.navigate(["/search"], {
            queryParams: { course: this.searchcourses }
          });
        }
        this.foundCourses = courses;
      })
      .catch(error => Observable.throw(error.json().message));
  }

  getCourse(id) {
    return this.http
      .get(
        `${environment.BASEURL}/api/course/${id}`,
        this.options
      )
      .map(res => res.json())
      .map(course => this.viewCourse = course)
      .catch(error => Observable.throw(error.json().message));
  }
}
