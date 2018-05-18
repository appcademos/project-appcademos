import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";
import { MapMarkersService } from "./map-markers.service";

@Injectable()
export class CoursesService {
  options: any = { withCredentials: true };
  foundCourses: Array<any> = [];
  searching: Boolean = true;
  searchcourses: String;
  viewCourse: any;

  constructor(
    private http: Http,
    private router: Router,
    private mapService: MapMarkersService
  ) {}
  findCourses(searchcourses) {
    this.mapService.markers = [];
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
        this.setCoursesMarkers(courses);
        console.log(courses);
      })
      .catch(error => Observable.throw(error.json().message));
  }

  setCoursesMarkers(courses) {
    courses.forEach(course => {
      this.mapService.markers.push({
        lat: course.academy.location.coordinates[0],
        lng: course.academy.location.coordinates[1],
        draggable: false
      });
    });
  }

  getCourse(id) {
    return this.http
      .get(`${environment.BASEURL}/api/course/${id}`, this.options)
      .map(res => res.json())
      .map(course => (this.viewCourse = course))
      .catch(error => Observable.throw(error.json().message));
  }

  getAll() {
    return this.http
      .get(`${environment.BASEURL}/api/course/all`, this.options)
      .map(res => res.json())
      .map(courses => {
        this.searching = false;
        this.foundCourses = courses;
        this.setCoursesMarkers(courses);
      })
      .catch(error => Observable.throw(error.json().message));
  }
}
