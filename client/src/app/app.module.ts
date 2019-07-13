import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./routes.routing";

import { environment } from "../environments/environment.prod";

// LIBRARIES
import { AgmCoreModule } from "@agm/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';

// SERVICES
import { AcademySessionService } from "../services/academySession.service";
import { CoursesService } from "../services/courses.service";
import { GeolocationService } from "../services/geolocation.service";
import { MapMarkersService } from "../services/map-markers.service";
import { UserSessionService } from "../services/userSession.service";
import { UtilsService } from "../services/utils.service";
import { MessageService } from "../services/message.service";
import { SeoService } from "../services/seo.service";

// COMPONENTS
import { AcademyComponent } from "./academy/academy.component";
import { AcademyMapMarkerComponent } from "./academy-map-marker/academy-map-marker.component";
import { AllCoursesComponent } from "./allCourses/allCourses.component";
import { AppComponent } from "./app.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CoursesMapMarkersComponent } from "./courses-map-markers/courses-map-markers.component";
import { CreateCourseFormComponent } from "./createCourseForm/createCourseForm.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { IsAcademyButtonComponent } from "./isAcademyButton/isAcademyButton.component";
import { MapComponent } from "./map/map.component";
import { MapSearchboxComponent } from "./map-searchbox/map-searchbox.component";
import { OneCourseComponent } from "./oneCourse/oneCourse.component";
import { UserComponent } from "./user/user.component";
import { UserLoginFormComponent } from "./userLoginForm/userLoginForm.component";
import { UserSignupFormComponent } from "./userSignupForm/userSignupForm.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { AcademyprofileComponent } from './academyprofile/academyprofile.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { CoursesCarouselComponent } from './courses-carousel/courses-carousel.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { LoginComponent } from './login/login.component';
import { ButtonSpinnerComponent } from './uiComponents/button-spinner/button-spinner.component';
import { CookiesBoxComponent } from './cookies-box/cookies-box.component';
import { CookiesComponent } from './cookies/cookies.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioComponent } from './radio/radio.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

export function metaFactory(): MetaLoader
{
    return new MetaStaticLoader(
    {
        pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
        defaults:
        {
            title: 'Compara las Mejores Academias de Inglés en Madrid | Appcademos'
        }
    });
}

const fbLoginOptions: LoginOpt = {
  scope: 'email',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
 
const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
 
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("AIzaSyARBExbvgz2Zl8KWGCp1ku_HwCA47-2PY8",googleLoginOptions)

  },{
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("737521146398896",fbLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
   declarations: [
      AcademyComponent,
      AcademyMapMarkerComponent,
      AllCoursesComponent,
      AppComponent,
      CheckoutComponent,
      CoursesMapMarkersComponent,
      CreateCourseFormComponent,
      FooterComponent,
      HeaderComponent,
      HomeComponent,
      IsAcademyButtonComponent,
      MapComponent,
      MapSearchboxComponent,
      OneCourseComponent,
      UserComponent,
      UserLoginFormComponent,
      UserSignupFormComponent,
      ConfirmationComponent,
      AcademyprofileComponent,
      CourseCardComponent,
      CoursesCarouselComponent,
      SearchboxComponent,
      LoginComponent,
      ButtonSpinnerComponent,
      CookiesBoxComponent,
      CookiesComponent,
      PrivacyPolicyComponent,
      CheckboxComponent,
      RadioComponent,
      SocialLoginComponent
   ],

  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCYxJxUvlC9d_-w181lx5OxjJvtCwfDJ6w",
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    SocialLoginModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory)
    })
  ],
  providers: [
    AcademySessionService,
    CoursesService,
    GeolocationService,
    MapMarkersService,
    UserSessionService,
    MessageService,
    UtilsService,
    SeoService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
