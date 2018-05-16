import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { routes } from "./routes.routing";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

// LIBRARIES
import { AgmCoreModule } from "@agm/core";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// SERVICES
import { UserSessionService } from "../services/userSession.service";
import { AcademySessionService } from "../services/academySession.service";

// COMPONENTS
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HomeComponent } from "./home/home.component";
import { AcademyComponent } from "./academy/academy.component";
import { UserComponent } from "./user/user.component";
import { AllCoursesComponent } from "./allCourses/allCourses.component";
import { OneCourseComponent } from "./oneCourse/oneCourse.component";
import { UserLoginFormComponent } from "./userLoginForm/userLoginForm.component";
import { UserSignupFormComponent } from "./userSignupForm/userSignupForm.component";
import { AcademyLoginFormComponent } from "./academyLoginForm/academyLoginForm.component";
import { AcademySignupFormComponent } from "./academySignupForm/academySignupForm.component";
import { MapComponent } from "./map/map.component";
import { environment } from "../environments/environment";
import { GeolocationService } from "../services/geolocation.service";
import { SearchboxCoursesComponent } from './searchbox-courses/searchbox-courses.component';
import { IsAcademyButtonComponent } from './isAcademyButton/isAcademyButton.component';
import { MapSearchboxComponent } from './map-searchbox/map-searchbox.component';
import { MapMarkersService } from "../services/map-markers.service";
import { AcademyMapMarkerComponent } from './academy-map-marker/academy-map-marker.component';
import { CoursesMapMarkersComponent } from './courses-map-markers/courses-map-markers.component';
import { CoursesService } from "../services/courses.service";
import { DisplaySearchedCoursesComponent } from './displaySearchedCourses/displaySearchedCourses.component';
import { CreateCourseFormComponent } from './createCourseForm/createCourseForm.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AcademyComponent,
    UserComponent,
    AllCoursesComponent,
    OneCourseComponent,
    UserLoginFormComponent,
    UserSignupFormComponent,
    AcademyLoginFormComponent,
    AcademySignupFormComponent,
    MapComponent,
    SearchboxCoursesComponent,
    IsAcademyButtonComponent,
    MapSearchboxComponent,
    AcademyMapMarkerComponent,
    CoursesMapMarkersComponent,
    DisplaySearchedCoursesComponent,
    CreateCourseFormComponent,
    CheckoutComponent
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: environment.MAPS,
      libraries: ["places"]
    }),
    NgbModule.forRoot()
  ],
  providers: [UserSessionService, AcademySessionService, GeolocationService, MapMarkersService, CoursesService],
  bootstrap: [AppComponent]
})
export class AppModule {}
