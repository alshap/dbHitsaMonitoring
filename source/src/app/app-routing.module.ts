import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { MainPageComponent } from "./main-page/main-page.component";
import { ViewPageComponent } from "./view-page/view-page.component";
import { AboutPageComponent } from "./about-page/about-page.component";
import { SensorsViewPageComponent } from "./sensors-view-page/sensors-view-page.component";
import { ViewPageDetailsComponent } from "./view-page-details/view-page-details.component";

export const routes: Routes = [
    { path: "", redirectTo: "/main-page", pathMatch: "full" },
    { path: "main-page", component: MainPageComponent },
    { path: "view-page", component: ViewPageComponent },
    { path: "about-page", component: AboutPageComponent },
    { path: "sensors-view-page", component: SensorsViewPageComponent },
    { path: "view-page-details", component: ViewPageDetailsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
