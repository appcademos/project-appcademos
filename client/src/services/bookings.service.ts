import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs/Rx";

@Injectable()
export class BookingsService
{
    constructor(private http: HttpClient) { }
    
    createBooking(data)
    {
        return this.http
                .post(`${environment.BASEURL}/api/bookings/`, data)
                .catch(error => Observable.throw(error));
    }
    
    updateBooking(bookingId, data)
    {
        return this.http
                .put(`${environment.BASEURL}/api/bookings/${bookingId}`, data)
                .catch(error => Observable.throw(error));
    }
}
