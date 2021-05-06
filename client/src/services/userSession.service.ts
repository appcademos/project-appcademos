import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { MessageService } from './message.service';

@Injectable()
export class UserSessionService
{
  user: any;
  options: any = { withCredentials: true };

  constructor(private http: HttpClient, private messageService: MessageService)
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
      .pipe(
          map(user =>
          {
              this.handleUser(user);
              this.messageService.sendMessage({ user: user });
              return user;
          })
      )
     .pipe(catchError(error => Observable.throw(error)));
  }

  signup(user)
  {
    return this.http
      .post(`${environment.BASEURL}/api/user/signup`, user, this.options)
      .pipe(
          map(user =>
          {
              this.handleUser(user);
              this.messageService.sendMessage({ user: user });
              return user;
          })
      )
      .pipe(catchError(error => Observable.throw(error)));
  }

  login(user)
  {
    return this.http
      .post(`${environment.BASEURL}/api/user/login`, user, this.options)
      .pipe(
          map(user =>
          {
              this.handleUser(user);
              this.messageService.sendMessage({ user: user });
              return user;
          })
      )
      .pipe(catchError(error => Observable.throw(error)));
  }

  logout()
  {
    return this.http
      .get(`${environment.BASEURL}/api/user/logout`, this.options)
      .pipe(
          map(user =>
          {
              this.handleUser();
              this.messageService.sendMessage({ user: null });
              return null;
          })
      )
      .pipe(catchError(error => Observable.throw(error)));
  }
  
  loginFacebookToken(fbToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/facebook/login?access_token=${fbToken}`, this.options)
        .pipe(
            map(user =>
            {
                this.handleUser(user);
                this.messageService.sendMessage({ user: user });
                return user;
            })
        )
        .pipe(catchError(error => Observable.throw(error)));
  }
  signupFacebookToken(fbToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/facebook/signup?access_token=${fbToken}`, this.options)
        .pipe(
            map(user =>
            {
                this.handleUser(user);
                this.messageService.sendMessage({ user: user });
                return user;
            })
        )
        .pipe(catchError(error => Observable.throw(error)));
  }
  
  loginGoogleToken(googleToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/google/login?access_token=${googleToken}`, this.options)
        .pipe(
            map(user =>
            {
                this.handleUser(user);
                this.messageService.sendMessage({ user: user });
                return user;
            })
        )
        .pipe(catchError(error => Observable.throw(error)));
  }
  signupGoogleToken(googleToken)
  {
      return this.http
        .get(`${environment.BASEURL}/api/user/auth/google/signup?access_token=${googleToken}`, this.options)
        .pipe(
            map(user =>
            {
                this.handleUser(user);
                this.messageService.sendMessage({ user: user });
                return user;
            })
        )
        .pipe(catchError(error => Observable.throw(error)));
  }
  
  hasFavorite(courseId)
  {
      return (this.user != null) ? this.user.favorites.some(favorite => favorite._id === courseId) : null
  }
  addFavorite(courseId)
  {
      return this.http
      .post(`${environment.BASEURL}/api/user/add-favorite`, { courseId }, this.options)
      .pipe(
          map(res =>
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
                return res
            })
      )
        .pipe(
            catchError(error =>
            {            
                if (error != null)
                    return Observable.throw(error);
                else
                    return Observable.throw('Error adding favorite');
            })
        );
  }
  removeFavorite(courseId)
  {
      return this.http
      .post(`${environment.BASEURL}/api/user/remove-favorite`, { courseId }, this.options)
      .pipe(
          map(res =>
            {
                setTimeout(() => this.isLoggedIn().subscribe(), 500)
                return res
            })
      )
        .pipe(
            catchError(error =>
            {            
                if (error != null)
                    return Observable.throw(error);
                else
                    return Observable.throw('Error removing favorite');
            })
        );
  }
}
