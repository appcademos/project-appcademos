import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
        .map(coursesData =>
        {
            let courses = coursesData as any;
            this.searching = false;
            this.foundCourses = courses;
        })
        .catch(error =>
        {
            return Observable.throw(error);
        });
    }

    getCourse(id)
    {
        return this.http
          .get(`${environment.BASEURL}/api/course/${id}`, this.options)
          .map(course => (this.viewCourse = course))
          .catch(error => Observable.throw(error));
    }

    getAll()
    {
        return this.http
          .get(`${environment.BASEURL}/api/course/all`, this.options)
          .map(coursesData =>
          {
              let courses = coursesData as any;
              this.searching = false;
              this.foundCourses = courses;
          })
          .catch(error => Observable.throw(error));
    }

    createCourse(course)
    {
        return this.http
          .post(`${environment.BASEURL}/api/course`, course, this.options)
          .catch(error => Observable.throw(error));
    }

    updateCourse(courseId, course)
    {
          return this.http
            .put(`${environment.BASEURL}/api/course/${courseId}`, course, this.options)
            .catch(error => Observable.throw(error));
    }
    
    deleteCourse(courseId)
    {
          return this.http
            .delete(`${environment.BASEURL}/api/course/${courseId}`, this.options)
            .catch(error => Observable.throw(error));
    }


    createReview(review)
    {
        return this.http
          .post(`${environment.BASEURL}/api/review/`, review, this.options)
          .catch(error => Observable.throw(error));
    }
}
