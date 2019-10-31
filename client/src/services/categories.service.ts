import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from "@angular/http";
import { environment } from "../environments/environment";

@Injectable()
export class CategoriesService
{
    options: any = { withCredentials: true };
    
    constructor(private http: Http) {}
    
    getCategories()
    {
        return this.http
        .get(`${environment.BASEURL}/api/categories`, this.options)
        .map(res => res.json())
        .catch(error =>
        {
            if (error != null && error.json() != null && error.json().message != null)
                return Observable.throw(error.json().message);
            else
                return Observable.throw('Error get categories');
        });
    }
    
    updateCategory(category)
    {                
        return this.http
        .post(`${environment.BASEURL}/api/categories/${category._id}/update`, category, this.options)
        .map(res => res.json())
        .catch(error =>
        {            
            if (error != null)
                return Observable.throw(error);
            else
                return Observable.throw('Error updating category');
        });
    }
}
