import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";

@Injectable()
export class RequestService {
  options: any = { withCredentials: true };

  constructor(private http: Http) {}

  get(query: String) {
    return this.http
      .get(`${environment.BASEURL}`, this.options)
      .map(res => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || "Server error")
      );
  }

  put(query: String, data: Object) {
    return this.http
      .put(`${environment.BASEURL}${query}`, data, this.options)
      .map(res => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || "Server error")
      );
  }

  post(query: String, data: Object) {
    return this.http
      .post(`${environment.BASEURL}${query}`, data, this.options)
      .map(res => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || "Server error")
      );
  }

  delete(query: String) {
    return this.http
      .delete(`${environment.BASEURL}${query}`, this.options)
      .map(res => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || "Server error")
      );
  }
}
