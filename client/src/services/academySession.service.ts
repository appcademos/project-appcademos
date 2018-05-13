import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";

@Injectable()
export class AcademySessionService {
  academy: any;
  options: any = { withCredentials: true };

  constructor(private http: Http) {
    this.isLoggedIn().subscribe();
  }

  handleAcademy(academy?: object) {
    this.academy = academy;
    return this.academy;
  }

  isLoggedIn() {
    return this.http
      .get(`${environment.BASEURL}/api/academy/session`, this.options)
      .map(res => res.json())
      .map(academy => this.handleAcademy(academy))
      .catch(error => Observable.throw(error.json().message));
  }

  signup(academy) {
    return this.http
      .post(`${environment.BASEURL}/api/academy/signup`, academy, this.options)
      .map(academy => {
        return this.handleAcademy(academy);
      })
      .map(res => res.json())
      .catch(error => Observable.throw(error.json().message));
  }

  login(academy) {
    return this.http
      .post(`${environment.BASEURL}/api/academy/login`, academy, this.options)
      .map(res => res.json())
      .map(academy => this.handleAcademy(academy))
      .catch(error => Observable.throw(error.json().message));
  }

  logout() {
    return this.http
      .get(`${environment.BASEURL}/api/academy/logout`, this.options)
      .map(res => res.json())
      .map(() => this.handleAcademy())
      .catch(error => Observable.throw(error.json().message));
  }
}
