import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { OneCourseComponent } from "./oneCourse/oneCourse.component";
import { AllCoursesComponent } from "./allCourses/allCourses.component";
import { UserLoginFormComponent } from "./userLoginForm/userLoginForm.component";
import { CookiesComponent } from "./cookies/cookies.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { EstudioPersonalizadoComponent } from "./estudio-personalizado/estudio-personalizado.component";
import { ManagerComponent } from "./manager/manager/manager.component";
import { AcademyComponent } from "./manager/academy/academy.component";

export const routes: Routes = [
    { path: "", component: HomeComponent },

    { path: "all", component: AllCoursesComponent },
    { path: "search", component: AllCoursesComponent },
    { path: "checkout", component: CheckoutComponent },

    { path: "course/view", component: OneCourseComponent },
    { path: "course/:id", component: OneCourseComponent },
    { path: "course/:tag/:duration/:location/:academy/:id", component: OneCourseComponent },
    
    { path: "estudio-personalizado", component: EstudioPersonalizadoComponent},
    
    // Manager
    { path: "manager", component: ManagerComponent},
    { path: "manager/academy/:id", component: AcademyComponent},

    { path: "cookie-policy", component: CookiesComponent },
    { path: "privacy-policy", component: PrivacyPolicyComponent },

    { path: "**", redirectTo: "" }
];
