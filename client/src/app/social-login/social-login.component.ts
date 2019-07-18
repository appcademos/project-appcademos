import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { UserSessionService } from '../../services/userSession.service';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {


  constructor(private authService: AuthService,
              private userService: UserSessionService) { }

  private user: SocialUser;
  private loggedIn: boolean;
 
  showSignUp: boolean = false;
  sendingLogin: boolean = false;
  sendingSignup: boolean = false;
  loginComplete: boolean = false;
  signupComplete: boolean = false;

  login =
  {
      email: null,
      password: null
  }
  signup =
  {
      name: null,
      lastName: null,
      email: null,
      password: null,
      repeatPassword: null,
      conditionsAccepted: false,
      imagePath: null,
      authtoken: null,
      facebookID: null
  }
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  @Output() onClose = new EventEmitter();
  @Output() registerWithFacebook = new EventEmitter();
  @Output() registerWithGoogle  = new EventEmitter();

  ngOnInit() {
    // this.authService.authState.subscribe((user) => {
    //   alert("AUTH STATE CHANGED");

    //   this.user = user;
    //   this.loggedIn = (user != null);
    //   if (this.loggedIn == false) {
    //     alert("No user returned");
    //   } else {
    //     this.signup.name = this.user.firstName
    //     this.signup.lastName = this.user.lastName
    //     this.signup.email = this.user.email
    //     this.signup.authtoken = this.user.authToken
    //     this.signup.imagePath = this.user.photoUrl
    //     this.signup.facebookID = this.user.id
    //     this.sendSignup()
    //   }

    // });
  }

  ngOnDestroy()
  {
    console.log("ngOnDestroy")
    this.authService.authState.subscribe = null
  }

  ngOnChanges(changes)
  {
      if (changes.visible != null)
      {
          if (changes.visible.currentValue)
              document.body.style.overflow = 'hidden';
          else
          {
              document.body.style.overflow = 'unset';

              this.loginComplete = false;
              this.signupComplete = false;
          }
      }
  }
  
  signInWithGoogle(): void {
    console.log("register With Google " + GoogleLoginProvider.PROVIDER_ID)
    // this.authService. signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 
  signInWithFB(): void {
    // console.log("register With facebook " + FacebookLoginProvider.PROVIDER_ID)
    // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.registerWithFacebook.emit()
  } 
 
  signOut(): void {
    this.authService.signOut();
  }

  sendSignup()
  {
      if (this.validateSignup())
      {
          this.sendingSignup = true;

          let data =
            {
                name: this.signup.name + ' ' + this.signup.lastName,
                email: this.signup.email,
                authToken: this.user.authToken,
                imagePath: this.user.photoUrl,
                facebookID: this.user.id,
                password: this.user.authToken

            }
            console.log(data)

          this.userService.signup(data).subscribe(() =>
          {
              console.log("Signup succeeded")

              this.sendingSignup = false;
              this.signupComplete = true;

              setTimeout(() => this.close(), 3000);
          },
          error =>
          {
            console.log(error)
            if (error = "User already exists") {
              // alert("A user is already signed up with these credentials");
              this.sendingSignup = false;
              this.signupComplete = true;

              setTimeout(() => this.close(), 3000);
              // setTimeout(() => this.close(), 3000);
            } else {
              this.sendingSignup = false;
              alert((error.json != null) ? error.json().message : error);
              setTimeout(() => this.close(), 3000);
            }


          });
      }
  }

  sendLogin()
  {
      this.sendingLogin = true;

      var data =
      {
          username: this.login.email,
          password: this.login.password
      }
      console.log(data);

      this.userService.login(data).subscribe(() =>
      {
          this.sendingLogin = false;
          this.loginComplete = true;

          setTimeout(() => this.close(), 2000);
      },
      error =>
      {
          this.sendingLogin = false;
          alert((error.json != null) ? error.json().message : error);
      });
  }

  validateSignup()
  {
      var allOk = true;
      var message = 'Rellena correctamente todos los campos.';

      if (this.signup.email == null || this.signup.email.trim().length == 0)
      {
          allOk = false;
      }
      else if (!this.emailRegex.test(this.signup.email))
      {
          allOk = false;
          message = 'Introduce un email válido.';
      }


      if (this.signup.name == null || this.signup.name.trim().length == 0)
      {
          allOk = false;
      }

      if (this.signup.lastName == null || this.signup.lastName.trim().length == 0)
      {
          allOk = false;
      }

      if (!allOk)
          alert(message);

      return allOk;
  }

  close()
  {
      console.log("close emiitter")
      this.onClose.emit();
  }
}
