import { Injectable, EventEmitter } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { RequestService } from '../services/request.service'


@Injectable()
export class UserSessionService {

  user: any;
  userEvent: EventEmitter<any> = new EventEmitter();

  constructor(private request: RequestService) {
    this.isLoggedIn()
  }

  handleUser(user?: object) {
    this.user = user;
    this.userEvent.emit(this.user);
    console.log("pepe", this.user);
    return this.user;
  }

  signup(user) {
    this.request.post("/api/user/signup", user).subscribe(user => this.handleUser(user))
  }

  login(username, password) {
    this.request.post("/user/login", { username, password }).subscribe(user => this.handleUser(user))
  }

  logout() {
    this.request.get("/api/user/logout").subscribe(() => this.handleUser())
  }

  isLoggedIn() {
    this.request.get("/api/user/loggedin").subscribe(user => this.handleUser(user))
  }

}