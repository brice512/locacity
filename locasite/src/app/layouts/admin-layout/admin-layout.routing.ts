import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { LoginComponent } from "../../login/login.component";
import { AnnonceComponent } from "../../annonce/annonce.component";
import { ReservationComponent } from "../../reservation/reservation.component";
import { AuthGuard } from "../../helpers/AuthGuard";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  {
    path: "user-profile",
    canActivate: [AuthGuard],
    component: UserProfileComponent,
  },
  { path: "login", component: LoginComponent },
  { path: "annonce", canActivate: [AuthGuard], component: AnnonceComponent },
  {
    path: "reservation",
    canActivate: [AuthGuard],
    component: ReservationComponent,
  },
  { path: "**", redirectTo: "dashboard" },
];
