import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CategoriesService
{
    options: any = { withCredentials: true };
    
    constructor(private http: HttpClient) {}
    
    getCategories()
    {
        return this.http
        .get(`${environment.BASEURL}/api/categories`, this.options)
        .pipe(catchError(error => Observable.throw(error)));
    }
    
    updateCategory(category)
    {                
        return this.http
        .post(`${environment.BASEURL}/api/categories/${category._id}/update`, category, this.options)
        .pipe(
            catchError(error =>
            {            
                if (error != null)
                    return Observable.throw(error);
                else
                    return Observable.throw('Error updating category');
            })
        );
    }
}
