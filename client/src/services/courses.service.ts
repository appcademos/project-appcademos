import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";

@Injectable()
export class CoursesService {
    options: any = { withCredentials: true };
    searchcourses: String;
    foundCourses: Array<any> = [];

constructor(private http: Http) { }
findCourses(searchcourses) {
    searchcourses = searchcourses.replace(/[\s]/g, '+');
    this.searchcourses = searchcourses;

    return this.http.get(`${environment.BASEURL}/api/course/search?course=${this.searchcourses}`, this.options)
      .map(res => res.json())
      .map(courses => this.foundCourses = courses)
      .catch(error => Observable.throw(error.json().message));
  }
}
