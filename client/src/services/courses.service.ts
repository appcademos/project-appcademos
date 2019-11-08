import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";

@Injectable()
export class CoursesService
{
    options: any = { withCredentials: true };
    foundCourses: Array<any> = [];
    searching: Boolean = true;
    searchcourses: String;
    viewCourse: any;

    constructor(private http: Http,
                private router: Router)
    {}

    findCourses(searchcourses)
    {
        this.searchcourses = searchcourses.replace(/[\s]/g, "+");

        return this.http
        .get(`${environment.BASEURL}/api/course/search?course=${this.searchcourses}`, this.options)
        .map(res => res.json())
        .map(courses =>
        {
            this.searching = false;
            this.foundCourses = courses;
        })
        .catch(error =>
        {
            if (error != null && error.json() != null && error.json().message != null)
                return Observable.throw(error.json().message);
        });
    }

    getCourse(id)
    {
        return this.http
          .get(`${environment.BASEURL}/api/course/${id}`, this.options)
          .map(res => res.json())
          .map(course => (this.viewCourse = course))
          .catch(error => Observable.throw(error));
    }

    getAll()
    {
        return this.http
          .get(`${environment.BASEURL}/api/course/all`, this.options)
          .map(res => res.json())
          .map(courses => {
            this.searching = false;
            this.foundCourses = courses;
          })
          .catch(error => Observable.throw(error.json().message));
    }

    setSearchValue(value)
    {
        if (value === "Precio") {
          this.foundCourses.sort(function(a, b) {
            return a.price - b.price;
          });
        }
    }

    createCourse(course)
    {
        return this.http
          .post(`${environment.BASEURL}/api/course`, course, this.options)
          .map(res => res.json())
          .catch(error => Observable.throw(error.json()));
    }

    updateCourse(courseId, course)
    {
          return this.http
            .put(`${environment.BASEURL}/api/course/${courseId}`, course, this.options)
            .map(res => res.json())
            .catch(error => Observable.throw(error));
    }


    createReview(review)
    {
        return this.http
          .post(`${environment.BASEURL}/api/review/create`, review, this.options)
          .map(res => res.json())
          .catch(error => Observable.throw(error));
    }
}
