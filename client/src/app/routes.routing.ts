import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { AcademyComponent } from './academy/academy.component';
import { AllCoursesComponent } from './allCourses/allCourses.component';
import { OneCourseComponent } from './oneCourse/oneCourse.component';
import { UserLoginFormComponent } from './userLoginForm/userLoginForm.component';
import { UserSignupFormComponent } from './userSignupForm/userSignupForm.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
   { path: '', component: HomeComponent},
   { path: 'user', component: UserComponent},
   { path: 'academy', component: AcademyComponent},
   { path: 'search', component: AllCoursesComponent},
   { path: 'course/view', component: OneCourseComponent},
   { path: 'enter', component: UserSignupFormComponent},
   {path: 'checkout', component: CheckoutComponent},
   { path: '**', redirectTo: ''}
];
