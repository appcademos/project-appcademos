import { Routes } from "@angular/router";
import { HomeComponent } from "./screens/home/home.component";
import { CheckoutComponent } from "./screens/checkout/checkout.component";
import { OneCourseComponent } from "./screens/oneCourse/oneCourse.component";
import { AllCoursesComponent } from "./screens/allCourses/allCourses.component";
import { CookiesComponent } from "./screens/cookies/cookies.component";
import { PrivacyPolicyComponent } from "./screens/privacy-policy/privacy-policy.component";
import { EstudioPersonalizadoComponent } from "./screens/estudio-personalizado/estudio-personalizado.component";
import { ManagerComponent } from "./screens/manager/manager/manager.component";
import { AcademyComponent } from "./screens/manager/academy/academy.component";
import { FavoritesComponent } from './screens/favorites/favorites.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },

    //{ path: "all", component: AllCoursesComponent },
    { path: "cursos-ingles/:category", component: AllCoursesComponent },

    { path: "cursos-ingles/curso/:id", component: OneCourseComponent },
    { path: "cursos-ingles/:category/:academy/:id", component: OneCourseComponent },
    
    { path: "cursos-ingles/:category/:academy/:id/checkout", component: CheckoutComponent },
    { path: "cursos-ingles/:category/:academy/:id/pedir-informacion", component: CheckoutComponent },
    
    { path: "estudio-personalizado", component: EstudioPersonalizadoComponent},
    
    { path: "favoritos", component: FavoritesComponent},
    
    // Manager
    { path: "manager", component: ManagerComponent},
    { path: "manager/academy/:id", component: AcademyComponent},

    { path: "cookie-policy", component: CookiesComponent },
    { path: "privacy-policy", component: PrivacyPolicyComponent },

    { path: "**", redirectTo: "" }
];
