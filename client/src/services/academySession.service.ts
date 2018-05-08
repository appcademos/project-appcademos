import { Injectable, EventEmitter} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { RequestService } from '../services/request.service'


@Injectable()
export class academySessionService {

academy:any;
 academyEvent: EventEmitter<any> = new EventEmitter();

 constructor(private request: RequestService) {
   this.isLoggedIn()
 }

 handleError(e) {
   return Observable.throw(e.json().message);
 }

 handleAcademy(academy?:object){
   this.academy = academy;
   this.academyEvent.emit(this.academy);
   return this.academy;
 }

 signup(academy) {
    this.request.post("/api/academy/signup", academy)
     .map(res => res.json())
     .map(academy => this.handleAcademy(academy))
     .catch(this.handleError);
 }

 login(academyname, password) {
    this.request.post("/api/academy/login", {academyname,password})
     .map(res => res.json())
     .map(academy => this.handleAcademy(academy))
     .catch(this.handleError);
 }

 logout() {
    this.request.get("/api/academy/logout")
     .map(() => this.handleAcademy())
     .catch(this.handleError);
 }

 isLoggedIn() {
    this.request.get("/api/academy/loggedin")
     .map(res => res.json())
     .map(academy => this.handleAcademy(academy))
     .catch(this.handleError);
 }

}