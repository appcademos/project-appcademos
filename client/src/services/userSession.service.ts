import { Injectable, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";
import { MessageService } from './message.service';

@Injectable()
export class UserSessionService
{
  user: any;
  options: any = { withCredentials: true };

  constructor(private http: Http, private messageService: MessageService)
  {
      this.isLoggedIn().subscribe(
          res => {},
          err => {}
      );
  }

  handleUser(user?: object) {
    this.user = user;
    return this.user;
  }

  isLoggedIn() {
    return this.http
      .get(`${environment.BASEURL}/api/user/session`, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.messageService.sendMessage({ user: user });
          return this.handleUser(user);
      })
      .catch(error => Observable.throw(error));
  }

  signup(user) {
    return this.http
      .post(`${environment.BASEURL}/api/user/signup`, user, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.messageService.sendMessage({ user: user });
          return this.handleUser(user);
      })
      .catch(error => Observable.throw(error.json().message));
  }

  login(user) {
    return this.http
      .post(`${environment.BASEURL}/api/user/login`, user, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.messageService.sendMessage({ user: user });
          return this.handleUser(user);
      })
      .catch(error => Observable.throw(error.json().message));
  }

  logout() {
    return this.http
      .get(`${environment.BASEURL}/api/user/logout`, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.messageService.sendMessage({ user: null });
          return this.handleUser();
      })
      .catch(error => Observable.throw(error.json().message));
  }
  
  loginFacebookToken(fbToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/facebook/login?access_token=${fbToken}`, this.options)
        .map(res => res.json())
        .map(user =>
        {
            this.messageService.sendMessage({ user: user });
            return this.handleUser(user);
        })
        .catch(error => Observable.throw(error));
  }
  signupFacebookToken(fbToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/facebook/signup?access_token=${fbToken}`, this.options)
        .map(res => res.json())
        .map(user =>
        {
            this.messageService.sendMessage({ user: user });
            return this.handleUser(user);
        })
        .catch(error => Observable.throw(error));
  }
  
  loginGoogleToken(googleToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/google/login?access_token=${googleToken}`, this.options)
        .map(res => res.json())
        .map(user =>
        {
            this.messageService.sendMessage({ user: user });
            return this.handleUser(user);
        })
        .catch(error => Observable.throw(error));
  }
  signupGoogleToken(googleToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/google/signup?access_token=${googleToken}`, this.options)
        .map(res => res.json())
        .map(user =>
        {
            this.messageService.sendMessage({ user: user });
            return this.handleUser(user);
        })
        .catch(error => Observable.throw(error));
  }
}
