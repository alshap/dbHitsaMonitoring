import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { MainPageComponent } from './main-page/main-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ViewPageComponent } from './view-page/view-page.component';

import { DatabaseService } from './services/database.service';
import { SqliteService } from './services/sqlite.service';

import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { SensorsViewPageComponent } from './sensors-view-page/sensors-view-page.component';
import { ViewPageDetailsComponent } from './view-page-details/view-page-details.component';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptUISideDrawerModule
    ],
    declarations: [
        AppComponent,
        MainPageComponent,
        AboutPageComponent,
        ViewPageComponent,
        SensorsViewPageComponent,
        ViewPageDetailsComponent
    ],
    providers: [
        DatabaseService,
        SqliteService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
