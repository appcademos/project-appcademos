import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule}from '@angular/forms';
import {routes} from './routes.routing'
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { RequestService } from '../services/request.service';
import { UserSessionService } from '../services/userSession.service';
import { AcademySessionService } from '../services/academySession.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AcademyComponent } from './academy/academy.component';
import { UserComponent } from './user/user.component';
import { AllCoursesComponent } from './allCourses/allCourses.component';
import { OneCourseComponent } from './oneCourse/oneCourse.component';
import { UserFormComponent } from './userForm/userForm.component';
import { AcademyFormComponent } from './academyForm/academyForm.component';

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
    UserFormComponent,
    AcademyFormComponent
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [RequestService, UserSessionService, AcademySessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
