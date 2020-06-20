import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Sensor } from '../interfaces/Sensor';
import { Router } from '@angular/router';
import { connectionType, getConnectionType, startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Status } from '../interfaces/Status';
import { SqliteService } from '../services/sqlite.service';
import { Record } from '../interfaces/Record';
import { Frame, topmost } from "tns-core-modules/ui/frame";

@Component({
  selector: 'ns-sensors-view-page',
  templateUrl: './sensors-view-page.component.html',
  styleUrls: ['./sensors-view-page.component.css']
})
export class SensorsViewPageComponent implements OnInit {

  constructor(private db: DatabaseService, private _router:Router, private sqlite: SqliteService) { }

  private sensors: Sensor[];
  private connectionTypeString = "No Internet connection";
  private isInternetConnection: boolean;
  private notLoaded: boolean = true;
  private loadingValue: number = 0;
  private statuses: Array<Status>;
  private records: Record[];
  


  ngOnInit(): void {
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


  this.statuses = this.sqlite.getAllCS();

  this.db.getRecords().subscribe(res => {
    this.records = <Record[]>res;
    if (this.records.length > 1){
      for (var i = 0;i < this.records.length;i++){
        this.checkPersistStatus(this.records[i][0]);

      }
    }
    this.notLoaded = false;
  });

    this.db.getSensors().subscribe(res => {
      this.sensors = <Sensor[]>res;
      this.notLoaded = false;
        }
      );

  }


  checkConnection(type){  
    if (type == connectionType.none){
      return false;
    }else{
      return true;
    }
  }
  
  navigateOnDetails(id){
    console.log("Navigating on id: " + String(id));
    this._router.navigate(['/view-page-details', {
      "id_cs": id
      }]);
    }

    checkPersistStatus(id_cs){
      return this.sqlite.checkExists(id_cs);
    }

  onDrawerButtonTap(): void {
      const sideDrawer = <RadSideDrawer>app.getRootView();
      sideDrawer.showDrawer();
    }
  
  closeDrawerOnInit(){
      const sideDrawer = <RadSideDrawer>app.getRootView();
      sideDrawer.closeDrawer();
    }

  changeStatus(id_cs, status){  
    this.sqlite.changeStatus(id_cs, status);
    this.ngOnInit();
    
}
}


