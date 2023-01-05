import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { ChartsModule } from "ng2-charts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { LoginComponent } from "../../login/login.component";
import { AnnonceComponent } from "../../annonce/annonce.component";
import { ReservationComponent } from "../../reservation/reservation.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    LoginComponent,
    AnnonceComponent,
    ReservationComponent,
  ],
})
export class AdminLayoutModule {}
