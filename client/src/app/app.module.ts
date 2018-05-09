import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { routes } from "./routes.routing";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

// LIBRARIES
import { AgmCoreModule } from "@agm/core";

// SERVICES
import { RequestService } from "../services/request.service";
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
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: environment.MAPS
    })
  ],
  providers: [RequestService, UserSessionService, AcademySessionService],
  bootstrap: [AppComponent]
})
export class AppModule {}
