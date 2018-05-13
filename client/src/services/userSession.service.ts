import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";

@Injectable()
export class UserSessionService {
  user: any;
  options: any = { withCredentials: true };

  constructor(private http: Http) {
    this.isLoggedIn().subscribe();
  }

  handleUser(user?: object) {
    this.user = user;
    return this.user;
  }

  isLoggedIn() {
    return this.http
      .get(`${environment.BASEURL}/api/user/session`, this.options)
      .map(res => res.json())
      .map(user => this.handleUser(user))
      .catch(error => Observable.throw(error.json().message));
  }

  signup(user) {
    return this.http
      .post(`${environment.BASEURL}/api/user/signup`, user, this.options)
      .map(res => res.json())
      .map(user => this.handleUser(user))
      .catch(error => Observable.throw(error.json().message));
  }

  login(user) {
    return this.http
      .post(`${environment.BASEURL}/api/user/login`, user, this.options)
      .map(res => res.json())
      .map(user => this.handleUser(user))
      .catch(error => Observable.throw(error.json().message));
  }

  logout() {
    return this.http
      .get(`${environment.BASEURL}/api/user/logout`, this.options)
      .map(res => res.json())
      .map(() => this.handleUser())
      .catch(error => Observable.throw(error.json().message));
  }
}
