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
import {
  MatAutocompleteModule,
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
  MatDividerModule,
  MatDialogModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule
} from "@angular/material";
import { AttendanceComponent } from "./attendance/attendance.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { QrCreatorComponent } from "./qr-creator/qr-creator.component";
import { ManualEntryComponent } from "./manual-entry/manual-entry.component";
import { SubmitDialogComponent } from "./submit-dialog/submit-dialog.component";
import { AttendanceTableComponent } from "./attendance-table/attendance-table.component";
import { GenericTableComponent } from "./generic-table/generic-table.component";
import { QrCodeComponent } from "./qr-code/qr-code.component";
import { ContactDialogComponent } from "./contact-dialog/contact-dialog.component";
import { ContactInfoComponent } from "./contact-info/contact-info.component";
import { ManualQrComponent } from "./manual-qr/manual-qr.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ChartsComponent } from "./charts/charts.component";
@NgModule({
  declarations: [
    AppComponent,
    routingModules,
    QrCreatorComponent,
    ManualEntryComponent,
    SubmitDialogComponent,
    AttendanceTableComponent,
    GenericTableComponent,
    QrCodeComponent,
    ContactDialogComponent,
    ContactInfoComponent,
    ManualQrComponent,
    ToolbarComponent,
    ChartsComponent
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
    MatSelectModule,
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  bootstrap: [AppComponent],
  entryComponents: [ManualEntryComponent, ChartsComponent]
})
export class AppModule {}
