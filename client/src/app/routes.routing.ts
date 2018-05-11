import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { AcademyComponent } from './academy/academy.component';
import { AllCoursesComponent } from './allCourses/allCourses.component';
import { OneCourseComponent } from './oneCourse/oneCourse.component';

export const routes: Routes = [
   { path: '', component: HomeComponent},
   { path: 'user', component: UserComponent},
   { path: 'academy', component: AcademyComponent},
   { path: 'courses', component: AllCoursesComponent},
   { path: 'courses/:id', component: OneCourseComponent},
   { path: '**', redirectTo: ''}
];
