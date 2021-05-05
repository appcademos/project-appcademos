import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable()
export class CategoriesService
{
    options: any = { withCredentials: true };
    
    constructor(private http: HttpClient) {}
    
    getCategories()
    {
        return this.http
        .get(`${environment.BASEURL}/api/categories`, this.options)
        .catch(error =>
        {
            return Observable.throw(error);
        });
    }
    
    updateCategory(category)
    {                
        return this.http
        .post(`${environment.BASEURL}/api/categories/${category._id}/update`, category, this.options)
        .catch(error =>
        {            
            if (error != null)
                return Observable.throw(error);
            else
                return Observable.throw('Error updating category');
        });
    }
}
