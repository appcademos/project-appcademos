import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";

@Injectable()
export class AcademySessionService
{
    options: any = { withCredentials: true };

    constructor(private http: Http) {}
    
    getAcademies()
    {
        return this.http
        .get(`${environment.BASEURL}/api/academy/all`, this.options)
        .map(res => res.json())
        .catch(error => Observable.throw(error));
    }

    getAcademy(academyId?: string)
    {
        let url = `${environment.BASEURL}/api/academy/${((academyId != null) ? academyId : '')}`;
        
        return this.http
            .get(url, this.options)
            .map(res => res.json())
            .catch(error => Observable.throw(error));
    }

    updateAcademy(academyId, academy)
    {
        return this.http
          .put(`${environment.BASEURL}/api/academy/update/${academyId}`, academy, this.options)
          .map(res => res.json())
          .catch(error => Observable.throw(error));
    }
}
