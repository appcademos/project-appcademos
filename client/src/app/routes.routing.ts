import { Routes } from "@angular/router";
import { UserComponent } from "./user/user.component";
import { HomeComponent } from "./home/home.component";
import { AcademyComponent } from "./academy/academy.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { OneCourseComponent } from "./oneCourse/oneCourse.component";
import { AllCoursesComponent } from "./allCourses/allCourses.component";
import { UserLoginFormComponent } from "./userLoginForm/userLoginForm.component";
import { UserSignupFormComponent } from "./userSignupForm/userSignupForm.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { AcademyprofileComponent } from "./academyprofile/academyprofile.component";

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "user", component: UserComponent },
    { path: "all", component: AllCoursesComponent },
    { path: "academy", component: AcademyComponent },
    { path: "search", component: AllCoursesComponent },
    { path: "checkout", component: CheckoutComponent },
    { path: "confirmation", component : ConfirmationComponent},
    { path: "enter", component: UserSignupFormComponent },
    { path: "course/view", component: OneCourseComponent },
    { path: "academyprofile", component: AcademyprofileComponent},
    { path: "**", redirectTo: "" }
];
