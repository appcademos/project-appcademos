import { Injectable, EventEmitter} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { RequestService } from '../services/request.service'


@Injectable()
export class UserSessionService {

user:any;
 userEvent: EventEmitter<any> = new EventEmitter();

 constructor(private request: RequestService) {
   this.isLoggedIn()
 }

 handleError(e) {
   return Observable.throw(e.json().message);
 }

 handleUser(user?:object){
   this.user = user;
   this.userEvent.emit(this.user);

   console.log("pepe",this.user);
   return this.user;
 }

 signup(user) {
    this.request.post("/user/signup", user).subscribe(
      user => this.handleUser(user)
    )
 }

 login(username, password) {
    this.request.post("/api/user/login", {username,password})
     .map(res => res.json())
     .map(user => this.handleUser(user))
     .catch(this.handleError);
 }

 logout() {
    this.request.get("/api/user/logout")
     .map(() => this.handleUser())
     .catch(this.handleError);
 }

 isLoggedIn() {
    this.request.get("/api/user/loggedin")
     .map(res => res.json())
     .map(user => this.handleUser(user))
     .catch(this.handleError);
 }

}