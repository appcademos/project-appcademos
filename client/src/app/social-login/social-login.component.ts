import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  private user: SocialUser;
  private loggedIn: boolean;
 
 
  ngOnInit() {
    console.log("ngOnInit" + this.authService.authState)
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user)
      this.loggedIn = (user != null);
    });

  }

  signInWithGoogle(): void {
    console.log("signInWithGoogle " + GoogleLoginProvider.PROVIDER_ID)
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 
 
  signOut(): void {
    this.authService.signOut();
  }
}
