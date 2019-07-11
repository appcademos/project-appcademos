import { Component, OnInit } from '@angular/core';
import { AuthService, AuthServiceConfig } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

let config = new AuthServiceConfig([
  {
    id: "appcademos",
    provider: new GoogleLoginProvider("AIzaSyARBExbvgz2Zl8KWGCp1ku_HwCA47-2PY8")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id")
  }
]);
 
export function provideConfig() {
  return config;
}

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signInWithGoogle(): void {
    console.log("signInWithGoogle")
    this.authService.signIn("AIzaSyARBExbvgz2Zl8KWGCp1ku_HwCA47-2PY8");
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 
 
  signOut(): void {
    this.authService.signOut();
  }
}
