import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { RequestService } from '../services/request.service'


@Injectable()
export class AcademySessionService {



  constructor(private request: RequestService) {
    this.isLoggedIn()
  }


  signup(academy) {
    this.request.post("/api/academy/signup", academy).subscribe(academy => this.request.handleUser(academy))
  }

  login(academy) {
    this.request.post("/api/academy/login", academy).subscribe(academy => this.request.handleUser(academy))
  }

  logout() {
    this.request.get("/api/academy/logout").subscribe(() => this.request.handleUser())
  }

  isLoggedIn() {
    this.request.get("/api/academy/loggedin").subscribe(academy => this.request.handleUser(academy))
  }

}