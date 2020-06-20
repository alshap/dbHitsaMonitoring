import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { connectionType, getConnectionType, startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";

@Component({
  selector: 'ns-view-page-details',
  templateUrl: './view-page-details.component.html',
  styleUrls: ['./view-page-details.component.css']
})
export class ViewPageDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private db: DatabaseService) { }

  private sub: any;
  private id_cs: String;
  private CSdetails;
  private notLoaded: boolean = true;
  private loadingValue: number = 0;
  private connectionTypeString = "No Internet connection";
  private isInternetConnection: boolean;

  ngOnInit(): void {
    this.notLoaded = true;
    this.loadingValue = 0;

    this.sub = this.route.params.subscribe(params => {
      this.id_cs = params["id_cs"]; 
    });

    this.closeDrawerOnInit();
    const type = getConnectionType();
    this.isInternetConnection = this.checkConnection(type);
    
    startMonitoring((newConnectionType) => {
      if (newConnectionType == connectionType.none){
        this.isInternetConnection = false;
      }else{
        this.isInternetConnection = true;
      }
  });
    this.db.getCsDetails(this.id_cs).subscribe(res => {
      this.CSdetails = res;
      if (this.CSdetails[0].length > 1){
        this.notLoaded = false;
      }
    });
  }

  ngOnDestroy(){
    stopMonitoring();
  }

  checkConnection(type){  
    if (type == connectionType.none){
      return false;
    }else{
      return true;
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeDrawerOnInit(){
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

}
