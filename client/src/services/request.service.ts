import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";

@Injectable()
export class RequestService {
  user: any;
  userEvent: EventEmitter<any> = new EventEmitter();
  options: any = { withCredentials: true };

  constructor(private http: Http) {}

  handleUser(user?: object) {
    this.user = user;
    this.userEvent.emit(this.user);
    return this.user;
  }

  get(query: String) {
    return this.http
      .get(`${environment.BASEURL}${query}`, this.options)
      .map(res => res.json())
      .catch(error => Observable.throw("Error in request GET service"));
  }

  put(query: String, data: Object) {
    return this.http
      .put(`${environment.BASEURL}${query}`, data, this.options)
      .map(res => res.json())
      .catch(error => Observable.throw("Error in request PUT service"));
  }

  post(query: String, data: Object) {
    return this.http
      .post(`${environment.BASEURL}${query}`, data, this.options)
      .map(res => res.json())
      .catch(error => Observable.throw("Error in request POST service"));
  }

  delete(query: String) {
    return this.http
      .delete(`${environment.BASEURL}${query}`, this.options)
      .map(res => res.json())
      .catch(error => Observable.throw("Error in request DELETE service"));
  }
}
