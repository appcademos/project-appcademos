import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserSessionService } from '../../../services/userSession.service';
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
        conditionsAccepted: false
    }

    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    @Input() visible: boolean = false;
    @Input() isFavorites: boolean = false
    @Output() onClose = new EventEmitter();

    constructor(private userService: UserSessionService,
                private router: Router,
                private authService: AuthService)
    {

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
     
    logInWithFB()
    {
        this.sendingLogin = true;
        
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) =>
        {            
            if (user == null)
            {
                this.sendingLogin = false;
                alert("Error\nNo se ha podido obtener el usuario de Facebook.");
            }
            else
            {
                this.userService.loginFacebookToken(user.authToken)
                .subscribe(res =>
                {                    
                    this.sendingLogin = false;
                    this.loginComplete = true;

                    setTimeout(() => this.close(), 2000);
                },
                error =>
                {
                    this.sendingLogin = false;
                    console.log(error);
                    
                    if (error.status === 404)
                        alert('Error\nEl usuario no tiene una cuenta creada.\nPulsa en "Regístrate" para crear tu cuenta.');
                    else
                        alert('Error\nSe ha producido un error al hacer login a través de Facebook.');
                });
            }
        })
        .catch(error =>
        {
            this.sendingLogin = false;
            console.log(error);
        });
    }
    signupWithFB()
    {
        this.sendingSignup = true;
        
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) =>
        {            
            if (user == null)
            {
                this.sendingSignup = false;
                alert("Error\nNo se ha podido obtener el usuario de Facebook.");
            }
            else
            {
                this.userService.signupFacebookToken(user.authToken)
                .subscribe(res =>
                {                    
                    this.sendingSignup = false;
                    this.signupComplete = true;

                    setTimeout(() => this.close(), 3000);
                },
                error =>
                {
                    this.sendingSignup = false;
                    console.log(error);
                    
                    alert('Error\nSe ha producido un error al hacer login a través de Facebook.');
                });
            }
        })
        .catch(error =>
        {
            this.sendingSignup = false;
            console.log(error);
        });
    }
    
    loginWithGoogle()
    {
        this.sendingLogin = true;
        
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) =>
        {            
            if (user == null)
            {
                this.sendingLogin = false;
                alert("Error\nNo se ha podido obtener el usuario de Google.");
            }
            else
            {
                this.userService.loginGoogleToken(user.idToken)
                .subscribe(res =>
                {                    
                    this.sendingLogin = false;
                    this.loginComplete = true;

                    setTimeout(() => this.close(), 2000);
                },
                error =>
                {
                    this.sendingLogin = false;
                    console.log(error);
                    
                    if (error.status === 404)
                        alert('Error\nEl usuario no tiene una cuenta creada.\nPulsa en "Regístrate" para crear tu cuenta.');
                    else
                        alert('Error\nSe ha producido un error al hacer login a través de Google.');
                });
            }
        })
        .catch(error =>
        {
            this.sendingLogin = false;
            console.log(error);
        });
    }
    signupWithGoogle()
    {
        this.sendingSignup = true;
        
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) =>
        {
            if (user == null)
            {
                this.sendingSignup = false;
                alert("Error\nNo se ha podido obtener el usuario de Google.");
            }
            else
            {
                this.userService.signupGoogleToken(user.idToken)
                .subscribe(res =>
                {                    
                    this.sendingSignup = false;
                    this.signupComplete = true;

                    setTimeout(() => this.close(), 3000);
                },
                error =>
                {
                    this.sendingSignup = false;
                    console.log(error);
                    
                    alert('Error\nSe ha producido un error al hacer login a través de Google.');
                });
            }
        })
        .catch(error =>
        {
            this.sendingSignup = false;
            console.log(error);
        });
    }

    close()
    {
        this.visible = false;
        this.onClose.emit();
    }
}
