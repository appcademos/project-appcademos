import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserSessionService } from '../../services/userSession.service';
import { Router } from "@angular/router";
import { Directive, HostBinding } from '@angular/core';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component(
{
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent
{
    showSignUp: boolean = false;
    sendingLogin: boolean = false;
    sendingSignup: boolean = false;
    loginComplete: boolean = false;
    signupComplete: boolean = false;

    private user: SocialUser;
    private loggedIn: boolean;

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

    @Input() visible: boolean = false;
    @Output() onClose = new EventEmitter();
    //@HostBinding('class.overflow') private _addOverflow = false;

    constructor(private userService: UserSessionService,
                private router: Router,
                private authService: AuthService)
    {

    }

    ngOnInit() {
        // this.authService.authState.subscribe((user) => {

    
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

    validateLogin()
    {
        var allOk = true;
        var message = 'Rellena correctamente todos los campos.';

        if (this.login.email == null || this.login.email.trim().length == 0)
        {
            allOk = false;
        }
        else if (!this.emailRegex.test(this.login.email))
        {
            allOk = false;
            message = 'Introduce un email válido.';
        }

        if (this.login.password == null || this.login.password.trim().length == 0)
        {
            allOk = false;
        }

        if (!allOk)
            alert(message);

        return allOk;
    }
    validateSignup()
    {
        console.log("validateSignup")
        var allOk = true;
        var message = 'Rellena correctamente todos los campos.';

        if (!this.signup.conditionsAccepted)
        {
            allOk = false;
            message = 'Acepta las condiciones.';
        }

        if (this.signup.password != null &&
            this.signup.repeatPassword != null &&
            this.signup.password != this.signup.repeatPassword)
        {
            allOk = false;
            message = 'Las contraseñas no coinciden.';
        }

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

        if (this.signup.password == null || this.signup.password.trim().length == 0)
        {
            allOk = false;
        }

        if (this.signup.repeatPassword == null || this.signup.repeatPassword.trim().length == 0)
        {
            allOk = false;
        }

        if (!allOk)
            alert(message);

        return allOk;
    }

    sendLogin()
    {
        if (this.validateLogin())
        {
            this.sendingLogin = true;

            var data =
            {
                username: this.login.email,
                password: this.login.password
            }

            this.userService.login(data).subscribe((user) =>
            {                
                this.sendingLogin = false;
                this.loginComplete = true;

                if (user != null && (user.role === 'admin' || user.role === 'academy'))
                {
                    setTimeout(() =>
                    {
                        this.close();
                        this.router.navigate(["/manager"]);
                    }, 1000);
                }
                else
                    setTimeout(() => this.close(), 2000);
            },
            error =>
            {
                this.sendingLogin = false;
                alert((error.json != null) ? error.json().message : error);
            });
        }
    }
    sendSignup()
    {
        if (this.validateSignup())
        {
            this.sendingSignup = true;

            let data =
            {
                name: this.signup.name,
                lastName: this.signup.lastName,
                email: this.signup.email,
                password: this.signup.password
            }

            this.userService.signup(data).subscribe(() =>
            {
                this.sendingSignup = false;
                this.signupComplete = true;

                setTimeout(() => this.close(), 3000);
            },
            error =>
            {
                this.sendingSignup = false;
                alert((error.json != null) ? error.json().message : error);
            });
        }
    }

    signUpWithFacebook()
    {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) =>
        {
            console.log(user)
            this.user = user;
            this.loggedIn = (user != null);
            if (this.loggedIn == false) {
              alert("No user returned");
            } else {
              console.log("user: "+user)
              let data =
              {
                  name: user.name + ' ' + user.lastName,
                  email: user.email,
                  authToken: user.authToken,
                  imagePath: user.photoUrl,
                  facebookID: user.id,
                  password: "1234"
  
              }
              this.userService.signup(data).subscribe(() =>
              {
                  this.sendingSignup = false;
                  this.signupComplete = true;
                  console.log("logged in " + data)
                  setTimeout(() => this.close(), 3000);
              },
              error =>
              {
                  this.sendingSignup = false;
                  console.log("sign up FAILED"  +error)
                  alert((error.json != null) ? error.json().message : error);
              });
            }
        });
        // this.authService.authState.subscribe((user) => {

        // });

    }
    
    signInWithGoogle(): void {
        console.log("signInWithGoogle " + GoogleLoginProvider.PROVIDER_ID)
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
     
    signInWithFB(): void
    {
        console.log("signInWithGoogle " + FacebookLoginProvider.PROVIDER_ID)
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) =>
        {
            this.user = user;
            this.loggedIn = (user != null);
            if (this.loggedIn == false) {
              alert("No user returned");
            } else {
                console.log("user: "+user.email)
                console.log("user: "+user.authToken)

              var data =
              {
                  username: user.email,
                  password: "1234"
              }
              console.log("data: "+data)
              //this.userService.isLoggedIn().subscribe
              this.userService.login(data).subscribe(() =>
              {
                  this.sendingSignup = false;
                  this.signupComplete = true;
                  console.log("logged in "  + data)
                  setTimeout(() => this.close(), 3000);
              },
              error =>
              {
                  this.sendingSignup = false;
                  console.log("logged in FAILED " + error)
  
                  alert((error.json != null) ? error.json().message : error);
              });
            }
        });
    } 

    close()
    {
        this.visible = false;
        this.onClose.emit();
    }
}
