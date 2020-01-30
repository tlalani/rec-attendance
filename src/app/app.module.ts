import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AppRoutingModule, routingModules } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { LayoutModule } from "@angular/cdk/layout";
import { FlexLayoutModule } from "@angular/flex-layout";
import { GridsterModule } from "angular-gridster2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "./../environments/environment";
import { TourMatMenuModule } from "ngx-tour-md-menu";
import { CookieService } from "ngx-cookie-service";
import { FlipModule } from "ngx-flip";
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTableModule,
  MatNativeDateModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTabsModule,
  MatDialogModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule
} from "@angular/material";
import { QrCreatorComponent } from "./qr-creator/qr-creator.component";
import { SubmitDialogComponent } from "./submit-dialog/submit-dialog.component";
import { AttendanceTableComponent } from "./attendance/attendance-table/attendance-table.component";
import { GenericTableComponent } from "./generic-table/generic-table.component";
import { QrCodeComponent } from "./qr-creator/qr-code/qr-code.component";
import { ContactDialogComponent } from "./contact-dialog/contact-dialog.component";
import { ContactInfoComponent } from "./contact-info/contact-info.component";
import { ManualQrComponent } from "./qr-creator/manual-qr/manual-qr.component";
import { ToolbarComponent } from "./home/toolbar/toolbar.component";
import { ChartsComponent } from "./charts/charts.component";
import { RecOptionsDialogComponent } from "./rec-options-dialog/rec-options-dialog.component";
import { AuthService } from "./auth.service";
import { EditRosterComponent } from "./edit-roster/edit-roster.component";
import { AddStudentsDialogComponent } from "./add-students-dialog/add-students-dialog.component";
import { RosterTableComponent } from "./edit-roster/roster-table/roster-table.component";
import { PasswordActionsComponent } from "./password-actions/password-actions.component";
import { ForgotComponent } from "./password-actions/forgot/forgot.component";
import { AdminUserListComponent } from "./admin-user-list/admin-user-list.component";
import { AdminUserListTableComponent } from "./admin-user-list/admin-user-list-table/admin-user-list-table.component";
import { RegisterComponent } from "./password-actions/register/register.component";
import { CreateComponent } from "./password-actions/create/create.component";
import { ResetFromEmailComponent } from "./password-actions/reset-from-email/reset-from-email.component";
import { ResetManualComponent } from "./password-actions/reset-manual/reset-manual.component";
import { AddShiftDialogComponent } from "./add-shift-dialog/add-shift-dialog.component";
import { AddStudentsDialogTableComponent } from './add-students-dialog/add-students-dialog-table/add-students-dialog-table/add-students-dialog-table.component';
@NgModule({
  declarations: [
    AppComponent,
    routingModules,
    QrCreatorComponent,
    SubmitDialogComponent,
    AttendanceTableComponent,
    GenericTableComponent,
    QrCodeComponent,
    ContactDialogComponent,
    ContactInfoComponent,
    ManualQrComponent,
    ToolbarComponent,
    ChartsComponent,
    RecOptionsDialogComponent,
    EditRosterComponent,
    AddStudentsDialogComponent,
    RosterTableComponent,
    AdminUserListComponent,
    AdminUserListTableComponent,
    RegisterComponent,
    CreateComponent,
    PasswordActionsComponent,
    ForgotComponent,
    ResetFromEmailComponent,
    ResetManualComponent,
    AddShiftDialogComponent,
    AddStudentsDialogTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    HttpClientModule,
    LayoutModule,
    MatTableModule,
    FlexLayoutModule,
    GridsterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    FlipModule,
    TourMatMenuModule.forRoot()
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    CookieService,
    AuthService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ChartsComponent,
    RecOptionsDialogComponent,
    EditRosterComponent,
    AddStudentsDialogComponent,
    SubmitDialogComponent,
    AdminUserListComponent,
    ResetManualComponent,
    AddShiftDialogComponent
  ]
})
export class AppModule {}
