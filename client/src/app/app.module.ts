import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./routes.routing";

import { environment } from "../environments/environment";

// LIBRARIES
import { AgmCoreModule } from "@agm/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// SERVICES
import { AcademySessionService } from "../services/academySession.service";
import { CoursesService } from "../services/courses.service";
import { GeolocationService } from "../services/geolocation.service";
import { MapMarkersService } from "../services/map-markers.service";
import { UserSessionService } from "../services/userSession.service";

// COMPONENTS
import { AcademyComponent } from "./academy/academy.component";
import { AcademyLoginFormComponent } from "./academyLoginForm/academyLoginForm.component";
import { AcademyMapMarkerComponent } from "./academy-map-marker/academy-map-marker.component";
import { AcademySignupFormComponent } from "./academySignupForm/academySignupForm.component";
import { AllCoursesComponent } from "./allCourses/allCourses.component";
import { AppComponent } from "./app.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CoursesMapMarkersComponent } from "./courses-map-markers/courses-map-markers.component";
import { CreateCourseFormComponent } from "./createCourseForm/createCourseForm.component";
import { DisplaySearchedCoursesComponent } from "./displaySearchedCourses/displaySearchedCourses.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { IsAcademyButtonComponent } from "./isAcademyButton/isAcademyButton.component";
import { MapComponent } from "./map/map.component";
import { MapSearchboxComponent } from "./map-searchbox/map-searchbox.component";
import { OneCourseComponent } from "./oneCourse/oneCourse.component";
import { SearchboxCoursesComponent } from "./searchbox-courses/searchbox-courses.component";
import { UserComponent } from "./user/user.component";
import { UserLoginFormComponent } from "./userLoginForm/userLoginForm.component";
import { UserSignupFormComponent } from "./userSignupForm/userSignupForm.component";
import { ConfirmationComponent } from './confirmation/confirmation.component';

@NgModule({
  declarations: [
    AcademyComponent,
    AcademyMapMarkerComponent,
    AcademyLoginFormComponent,
    AcademySignupFormComponent,
    AllCoursesComponent,
    AppComponent,
    CheckoutComponent,
    CoursesMapMarkersComponent,
    CreateCourseFormComponent,
    DisplaySearchedCoursesComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    IsAcademyButtonComponent,
    MapComponent,
    MapSearchboxComponent,
    OneCourseComponent,
    SearchboxCoursesComponent,
    UserComponent,
    UserLoginFormComponent,
    UserSignupFormComponent,
    ConfirmationComponent
],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.MAPS,
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AcademySessionService,
    CoursesService,
    GeolocationService,
    MapMarkersService,
    UserSessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
