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

  handleUser(user?: object) 
  {
    this.user = user;
    return this.user;
  }

  isLoggedIn()
  {
    return this.http
      .get(`${environment.BASEURL}/api/user/session`, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.handleUser(user);
          this.messageService.sendMessage({ user: user });
          return user;
      })
      .catch(error => Observable.throw(error));
  }

  signup(user)
  {
    return this.http
      .post(`${environment.BASEURL}/api/user/signup`, user, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.handleUser(user);
          this.messageService.sendMessage({ user: user });
          return user;
      })
      .catch(error => Observable.throw(error.json().message));
  }

  login(user)
  {
    return this.http
      .post(`${environment.BASEURL}/api/user/login`, user, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.handleUser(user);
          this.messageService.sendMessage({ user: user });
          return user;
      })
      .catch(error => Observable.throw(error.json().message));
  }

  logout()
  {
    return this.http
      .get(`${environment.BASEURL}/api/user/logout`, this.options)
      .map(res => res.json())
      .map(user =>
      {
          this.handleUser();
          this.messageService.sendMessage({ user: null });
          return null;
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
            this.handleUser(user);
            this.messageService.sendMessage({ user: user });
            return user;
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
            this.handleUser(user);
            this.messageService.sendMessage({ user: user });
            return user;
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
            this.handleUser(user);
            this.messageService.sendMessage({ user: user });
            return user;
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
            this.handleUser(user);
            this.messageService.sendMessage({ user: user });
            return user;
        })
        .catch(error => Observable.throw(error));
  }
  
  hasFavorite(courseId)
  {
      return (this.user != null) ? this.user.favorites.some(favorite => favorite._id === courseId) : null
  }
  addFavorite(courseId)
  {
      return this.http
      .post(`${environment.BASEURL}/api/user/add-favorite`, { courseId }, this.options)
      .map(res =>
        {
            setTimeout(() =>
            {
                this.isLoggedIn().subscribe()
                
                // Show favorites tutorial only the first time
                if (localStorage.getItem('favoritesTutorialShown') !== 'true')
                {
                    this.messageService.sendMessage({ showFavoritesTutorial: true })
                    localStorage.setItem('favoritesTutorialShown', 'true');
                }
            }, 500)
            return res.json()
        })
      .catch(error =>
      {            
          if (error != null)
              return Observable.throw(error);
          else
              return Observable.throw('Error adding favorite');
      });
  }
  removeFavorite(courseId)
  {
      return this.http
      .post(`${environment.BASEURL}/api/user/remove-favorite`, { courseId }, this.options)
      .map(res =>
        {
            setTimeout(() => this.isLoggedIn().subscribe(), 500)
            return res.json()
        })
      .catch(error =>
      {            
          if (error != null)
              return Observable.throw(error);
          else
              return Observable.throw('Error removing favorite');
      });
  }
}
