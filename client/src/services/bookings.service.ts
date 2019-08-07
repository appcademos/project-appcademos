import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs/Rx";

@Injectable()
export class BookingsService
{
    constructor(private http: Http) { }
    
    createBooking(data)
    {
        return this.http
                .post(`${environment.BASEURL}/api/bookings/`, data)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
    }
}
