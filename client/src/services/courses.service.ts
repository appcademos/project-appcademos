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

  constructor(private http: Http, private router: Router) {}
  findCourses(searchcourses) {
    
    searchcourses = searchcourses.replace(/[\s]/g, "+");
    this.searchcourses = searchcourses;

    return this.http
      .get(
        `${environment.BASEURL}/api/course/search?course=${this.searchcourses}`,
        this.options
      )
      .map(res => res.json())
      .map(courses => {
        if(courses){
          this.router.navigate(['/search'], { queryParams: { course: this.searchcourses } });
        }
        this.foundCourses = courses;
        console.log(this.foundCourses);
      })
      .catch(error => Observable.throw(error.json().message));
  }
}
