import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { connectionType, getConnectionType, startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import { Status } from '../interfaces/Status';
import { SqliteService } from '../services/sqlite.service';
import { Record } from '../interfaces/Record';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'ns-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  private records: Record[];
  private connectionTypeString = "No Internet connection";
  private isInternetConnection: boolean;
  private statuses: Array<Status>;
  private notLoaded: boolean = true;
  private loadingValue: number = 0;
  constructor(private sqlite: SqliteService, private db: DatabaseService) { }

  ngOnInit(): void {
    //this.closeDrawerOnInit();
    this.notLoaded = true;
    this.loadingValue = 0;

    //console.log(this.statuses);

    const type = getConnectionType();
    this.isInternetConnection = this.checkConnection(type);
    
    startMonitoring((newConnectionType) => {
      if (newConnectionType == connectionType.none){
        this.isInternetConnection = false;
      }else{
        this.isInternetConnection = true;
      }

      this.db.getRecords().subscribe(res => {
        this.records = <Record[]>res;
        if (this.records.length > 1){
          for (var i = 0;i < this.records.length;i++){
            this.checkPersistStatus(this.records[i][0]);
    
          }
        }
        this.notLoaded = false;
      });
    });

    //this.statuses = this.sqlite.getAllCS();

    /*
    this.db.getRecords().subscribe(res => {
      this.records = <Record[]>res;
      if (this.records.length > 1){
        for (var i = 0;i < this.records.length;i++){
          this.checkPersistStatus(this.records[i][0]);

        }
      }
      this.notLoaded = false;
    });
    */
   this.notLoaded = false;
  }

  ngOnDestroy(){
    stopMonitoring();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeDrawerOnInit(){
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }


  checkConnection(type){  
    if (type == connectionType.none){
      return false;
    }else{
      return true;
    }
  }

  checkPersistStatus(id_cs){
    return this.sqlite.checkExists(id_cs);
  }

  /*
  checkPersistStatus(id_cs){
    return this.sqlite.checkExists(id_cs);
  }
  */

  eraseDatabase(){
    this.sqlite.vacuum();
  }

}
