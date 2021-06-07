import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from "rxjs";
import { environment } from "../environments/environment";

@Injectable()
export class AcademySessionService
{
    options: any = { withCredentials: true };
    cities = []

    constructor(private http: HttpClient) {}
    
    
    getAcademies()
    {
        return this.http
        .get(`${environment.BASEURL}/api/academy/all`, this.options)
        .pipe(catchError(error => Observable.throw(error)));
    }

    getAcademy(academyId?: string)
    {
        let url = `${environment.BASEURL}/api/academy/${((academyId != null) ? academyId : '')}`;
        
        return this.http
            .get(url, this.options)
            .pipe(catchError(error => Observable.throw(error)));
    }
    
    createAcademy(academy)
    {
        return this.http
          .post(`${environment.BASEURL}/api/academy`, academy, this.options)
          .pipe(
              catchError(error => Observable.throw(error))
          );
    }

    updateAcademy(academyId, academy)
    {
        return this.http
          .put(`${environment.BASEURL}/api/academy/update/${academyId}`, academy, this.options)
          .pipe(catchError(error => Observable.throw(error)));
    }
    
    
    createReview(academyId, review)
    {
        return this.http
          .post(`${environment.BASEURL}/api/academy/${academyId}/review`, review, this.options)
          .pipe(catchError(error => Observable.throw(error)));
    }

    updateReview(reviewId, review)
    {
          return this.http
            .put(`${environment.BASEURL}/api/review/${reviewId}`, review, this.options)
            .pipe(catchError(error => Observable.throw(error)));
    }
    
    deleteReview(academyId, reviewId)
    {
          return this.http
            .post(`${environment.BASEURL}/api/academy/${academyId}/delete-review`, { reviewId }, this.options)
            .pipe(catchError(error => Observable.throw(error)));
    }
    
    
    getCities()
    {
        if (this.cities != null &&
            this.cities.length > 0)
        {
            return of(this.cities)
        }
        else
        {
            return this.http
            .get(`${environment.BASEURL}/api/cities/`, this.options)
            .pipe(
                map(data =>
                {
                    let d = data as any
                    this.cities = d
                    return this.cities
                })
            )
            .pipe(catchError(error => Observable.throw(error)));
        }
    }
}
