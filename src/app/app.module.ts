import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AppRoutingModule, routingModules } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { LayoutModule } from "@angular/cdk/layout";
import { FlexLayoutModule } from "@angular/flex-layout";
import { GridsterModule } from "angular-gridster2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "./../environments/environment";
import { normalize } from "../constants";
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTableModule,
  MatNativeDateModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTabsModule,
  MatDividerModule,
  MatDialogModule
} from "@angular/material";
import { AttendanceComponent } from "./attendance/attendance.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { QrCreatorComponent } from "./qr-creator/qr-creator.component";
import { ManualEntryComponent } from "./manual-entry/manual-entry.component";
import { SubmitDialogComponent } from "./submit-dialog/submit-dialog.component";
import { AttendanceTableComponent } from "./attendance-table/attendance-table.component";
import { GenericTableComponent } from './generic-table/generic-table.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
@NgModule({
  declarations: [
    AppComponent,
    routingModules,
    QrCreatorComponent,
    ManualEntryComponent,
    SubmitDialogComponent,
    AttendanceTableComponent,
    GenericTableComponent,
    QrCodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    HttpClientModule,
    LayoutModule,
    MatTableModule,
    MatNativeDateModule,
    FlexLayoutModule,
    GridsterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    AngularFireModule.initializeApp(normalize(environment.firebase)),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatDialogModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  bootstrap: [AppComponent],
  entryComponents: [
    HomeComponent,
    AttendanceComponent,
    LoginComponent,
    QrCreatorComponent,
    ManualEntryComponent,
    SubmitDialogComponent,
    AttendanceTableComponent
  ]
})
export class AppModule {}
