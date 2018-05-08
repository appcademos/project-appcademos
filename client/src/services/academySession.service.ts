import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { RequestService } from '../services/request.service'


@Injectable()
export class AcademySessionService {

  academy: any;
  academyEvent: EventEmitter<any> = new EventEmitter();

  constructor(private request: RequestService) {
    this.isLoggedIn()
  }

  handleAcademy(academy?: object) {
    this.academy = academy;
    this.academyEvent.emit(this.academy);
    console.log("pepe", this.academy);
    return this.academy;
  }

  signup(academy) {
    this.request.post("/api/academy/signup", academy).subscribe(academy => this.handleAcademy(academy))
  }

  login(academyName, password) {
    this.request.post("/api/academy/login", { academyName, password }).subscribe(academy => this.handleAcademy(academy))
  }

  logout() {
    this.request.get("/api/academy/logout").subscribe(() => this.handleAcademy())
  }

  isLoggedIn() {
    this.request.get("/api/academy/loggedin").subscribe(academy => this.handleAcademy(academy))
  }

}