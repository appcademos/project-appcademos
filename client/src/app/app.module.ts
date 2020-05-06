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
import { NzNotificationModule, NzModalModule, NzButtonModule, NzSelectModule, NzPopconfirmModule, NzRateModule, NzIconModule, NzSwitchModule, NzTagModule, NzEmptyModule, NzDropDownModule, NzMessageModule, NZ_I18N, NZ_ICONS, NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_NOTIFICATION_CONFIG, es_ES } from 'ng-zorro-antd';
import { QuillModule } from 'ngx-quill';
import { AbTestsModule } from 'angular-ab-tests';
import { LottieAnimationViewModule } from 'ng-lottie';
import { IconDefinition } from '@ant-design/icons-angular';
import { HeartTwoTone, LogoutOutline, SettingOutline } from '@ant-design/icons-angular/icons';

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
import { AcademyComponent } from "./screens/manager/academy/academy.component";
import { AllCoursesComponent } from "./screens/allCourses/allCourses.component";
import { AppComponent } from "./app.component";
import { CheckoutComponent } from "./screens/checkout/checkout.component";
import { CreateCourseFormComponent } from "./screens/manager/createCourseForm/createCourseForm.component";
import { CreateAcademyFormComponent } from "./screens/manager/createAcademyForm/createAcademyForm.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./screens/home/home.component";
import { OneCourseComponent } from "./screens/oneCourse/oneCourse.component";
import { CourseCardComponent } from './components/course-card/course-card.component';
import { CoursesCarouselComponent } from './components/courses-carousel/courses-carousel.component';
import { SearchboxComponent } from './components/searchbox/searchbox.component';
import { LoginComponent } from './components/login/login.component';
import { ButtonSpinnerComponent } from './components/uiComponents/button-spinner/button-spinner.component';
import { CookiesBoxComponent } from './components/cookies-box/cookies-box.component';
import { CookiesComponent } from './screens/cookies/cookies.component';
import { PrivacyPolicyComponent } from './screens/privacy-policy/privacy-policy.component';
import { CheckboxComponent } from './components/uiComponents/checkbox/checkbox.component';
import { RadioComponent } from './components/uiComponents/radio/radio.component';
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { EstudioPersonalizadoComponent } from './screens/estudio-personalizado/estudio-personalizado.component';
import { ManagerComponent } from './screens/manager/manager/manager.component';
import { TopBannerComponent } from './components/top-banner/top-banner.component';
import { TextArrayEditorComponent } from './screens/manager/_components/text-array-editor/text-array-editor.component';
import { ReviewEditorComponent } from './screens/manager/_components/review-editor/review-editor.component';
import { FavoritesComponent } from './screens/favorites/favorites.component';
import { FavoritesTutorialComponent } from './components/favorites-tutorial/favorites-tutorial.component';


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
 
let config = new AuthServiceConfig(
[
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("589677356916-ou4ks4n96sffnrhi1f97r042gfebtq75.apps.googleusercontent.com",googleLoginOptions)
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("2470689616374077",fbLoginOptions)
    }
]);

export function provideConfig() {
  return config;
}

/***** Antd icons config *****/
const icons: IconDefinition[] = [ HeartTwoTone, LogoutOutline, SettingOutline ]


@NgModule({
   declarations: [
      AcademyComponent,
      AllCoursesComponent,
      AppComponent,
      CheckoutComponent,
      CreateCourseFormComponent,
      CreateAcademyFormComponent,
      FooterComponent,
      HeaderComponent,
      HomeComponent,
      OneCourseComponent,
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
      EstudioPersonalizadoComponent,
      ManagerComponent,
      TopBannerComponent,
      TextArrayEditorComponent,
      ReviewEditorComponent,
      FavoritesComponent,
      FavoritesTutorialComponent
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
    NzPopconfirmModule,
    NzRateModule,
    NzSwitchModule,
    NzIconModule,
    NzTagModule,
    NzEmptyModule,
    NzDropDownModule,
    NzMessageModule,
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
    }),
    AbTestsModule.forRoot([
      {
        versions: [ 'A', 'B' ],
        versionForCrawlers: 'A',
        expiration: 30
      },
    ]),
    LottieAnimationViewModule.forRoot()
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
    CategoriesService,
    { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#E43450' },
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '80px' }}
  ],
  exports: [ AbTestsModule ],
  bootstrap: [AppComponent]
})
export class AppModule {}
