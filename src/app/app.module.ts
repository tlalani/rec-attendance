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
import { AttendanceTableComponent } from "./attendance-table/attendance-table.component";
import { GenericTableComponent } from "./generic-table/generic-table.component";
import { QrCodeComponent } from "./qr-code/qr-code.component";
import { ContactDialogComponent } from "./contact-dialog/contact-dialog.component";
import { ContactInfoComponent } from "./contact-info/contact-info.component";
import { ManualQrComponent } from "./manual-qr/manual-qr.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ChartsComponent } from "./charts/charts.component";
import { RecOptionsDialogComponent } from "./rec-options-dialog/rec-options-dialog.component";
import { AuthService } from "./auth.service";
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
    RecOptionsDialogComponent
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
  entryComponents: [ChartsComponent, RecOptionsDialogComponent]
})
export class AppModule {}
