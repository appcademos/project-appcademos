import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";
import { RequestService } from "../services/request.service";

@Injectable()
export class UserSessionService {

  constructor(private request: RequestService) {
    this.isLoggedIn();
  }

  signup(user) {
    this.request
      .post("/api/user/signup", user)
      .subscribe(user => this.request.handleUser(user));
  }

  login(user) {
    this.request
      .post("/api/user/login", user)
      .subscribe(user => {    
        this.request.handleUser(user)});
  }

  logout() {
    this.request.get("/api/user/logout").subscribe(() => this.request.handleUser());
  }

  isLoggedIn() {
    this.request
    .get("/api/user/loggedin")
    .subscribe(user => this.request.handleUser(user));
  }
}
