import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { AttendanceComponent } from "./attendance/attendance.component";
import { QrCreatorComponent } from "./qr-creator/qr-creator.component";
const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "createqr", component: QrCreatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingModules = [
  LoginComponent,
  HomeComponent,
  AttendanceComponent,
  QrCreatorComponent
];
