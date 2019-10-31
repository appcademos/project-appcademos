import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./routes.routing";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from "../environments/environment.prod";

// LIBRARIES
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { NzNotificationModule, NzModalModule, NzButtonModule, NzSelectModule, NZ_I18N, es_ES } from 'ng-zorro-antd';
import { QuillModule } from 'ngx-quill';

// SERVICES
import { AcademySessionService } from "../services/academySession.service";
import { CoursesService } from "../services/courses.service";
import { UserSessionService } from "../services/userSession.service";
import { UtilsService } from "../services/utils.service";
import { MessageService } from "../services/message.service";
import { SeoService } from "../services/seo.service";
import { BookingsService } from "../services/bookings.service";
import { CategoriesService } from "../services/categories.service";

// COMPONENTS
import { AcademyComponent } from "./manager/academy/academy.component";
import { AllCoursesComponent } from "./allCourses/allCourses.component";
import { AppComponent } from "./app.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CreateCourseFormComponent } from "./manager/createCourseForm/createCourseForm.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { IsAcademyButtonComponent } from "./isAcademyButton/isAcademyButton.component";
import { OneCourseComponent } from "./oneCourse/oneCourse.component";
import { UserLoginFormComponent } from "./userLoginForm/userLoginForm.component";
import { CourseCardComponent } from './course-card/course-card.component';
import { CoursesCarouselComponent } from './courses-carousel/courses-carousel.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { LoginComponent } from './login/login.component';
import { ButtonSpinnerComponent } from './uiComponents/button-spinner/button-spinner.component';
import { CookiesBoxComponent } from './cookies-box/cookies-box.component';
import { CookiesComponent } from './cookies/cookies.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CheckboxComponent } from './uiComponents/checkbox/checkbox.component';
import { RadioComponent } from './uiComponents/radio/radio.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { EstudioPersonalizadoComponent } from './estudio-personalizado/estudio-personalizado.component';
import { ManagerComponent } from './manager/manager/manager.component';
import { TopBannerComponent } from './top-banner/top-banner.component';


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
    provider: new GoogleLoginProvider("AIzaSyARBExbvgz2Zl8KWGCp1ku_HwCA47-2PY8")

  },{
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id",fbLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
   declarations: [
      AcademyComponent,
      AllCoursesComponent,
      AppComponent,
      CheckoutComponent,
      CreateCourseFormComponent,
      FooterComponent,
      HeaderComponent,
      HomeComponent,
      IsAcademyButtonComponent,
      OneCourseComponent,
      UserLoginFormComponent,
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
      SocialLoginComponent,
      EstudioPersonalizadoComponent,
      ManagerComponent,
      TopBannerComponent
   ],

  imports: [
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
    }),
    BrowserAnimationsModule,
    NzNotificationModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    QuillModule.forRoot({
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                //['blockquote'],

                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'align': [] }],

                ['clean'],                                         // remove formatting button

                ['link']                                            // link
            ]
        }
    })
  ],
  providers: [
    AcademySessionService,
    CoursesService,
    UserSessionService,
    MessageService,
    UtilsService,
    SeoService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    BookingsService,
    { provide: NZ_I18N, useValue: es_ES },
    CategoriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
