import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { Observable } from "rxjs";
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

    constructor(private http: HttpClient,
                private router: Router)
    {}

    findCourses(searchcourses, neighborhoods = null, city = null, modality = null, limit = null)
    {
        this.searchcourses = searchcourses.replace(/[\s]/g, "+");
        
        let modalityQuery = `&modality=${modality}`
        let cityQuery = (city != null) ? `&city=${city}` : '';
        let neighborhoodsQuery = (neighborhoods != null && neighborhoods.length > 0) ?
                                 `&neighborhoods=${JSON.stringify(neighborhoods)}` : '';
         let limitQuery = (limit != null) ? `&limit=${limit}` : '';

        return this.http
        .get(`${environment.BASEURL}/api/course/search?course=${this.searchcourses}${modalityQuery}${cityQuery}${neighborhoodsQuery}${limitQuery}`, this.options)
        .pipe(
            map(coursesData =>
            {
                let courses = coursesData as any;
                this.searching = false;
                this.foundCourses = courses;
            })
        )
        .pipe(
            catchError(error =>
            {
                return Observable.throw(error);
            })
        );
    }

    getCourse(id)
    {
        return this.http
          .get(`${environment.BASEURL}/api/course/${id}`, this.options)
          .pipe(map(course => (this.viewCourse = course)))
          .pipe(catchError(error => { return Observable.throw(error); }));
    }

    getAll()
    {
        return this.http
          .get(`${environment.BASEURL}/api/course/all`, this.options)
          .pipe(
              map(coursesData =>
              {
                  let courses = coursesData as any;
                  this.searching = false;
                  this.foundCourses = courses;
              })
          )
          .pipe(catchError(error => { return Observable.throw(error); }));
    }

    createCourse(course)
    {
        return this.http
          .post(`${environment.BASEURL}/api/course`, course, this.options)
          .pipe(catchError(error => { return Observable.throw(error); }));
    }

    updateCourse(courseId, course)
    {
          return this.http
            .put(`${environment.BASEURL}/api/course/${courseId}`, course, this.options)
            .pipe(catchError(error => { return Observable.throw(error); }));
    }
    
    deleteCourse(courseId)
    {
          return this.http
            .delete(`${environment.BASEURL}/api/course/${courseId}`, this.options)
            .pipe(catchError(error => { return Observable.throw(error); }));
    }


    createReview(review)
    {
        return this.http
          .post(`${environment.BASEURL}/api/review/`, review, this.options)
          .pipe(catchError(error => { return Observable.throw(error); }));
    }
}
