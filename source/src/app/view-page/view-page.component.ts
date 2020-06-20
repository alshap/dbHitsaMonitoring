import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Record } from '../interfaces/Record';
import { Status } from '../interfaces/Status';
import { connectionType, getConnectionType, startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Router } from '@angular/router';
import { EventData } from "tns-core-modules/data/observable";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { setInterval, clearInterval } from "tns-core-modules/timer";
import { SqliteService } from "../services/sqlite.service";
import { __core_private_testing_placeholder__ } from '@angular/core/testing';



@Component({
  selector: 'ns-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {

  constructor(private db: DatabaseService, private _router:Router, private sqlite: SqliteService) { }

  private tempRecords: Record[] = [];
  private records: Record[] = [];
  private okRecords: Record[] = [];
  private outdatedRecords: Record[] = [];
  private connectionTypeString = "No Internet connection";
  private isInternetConnection: boolean;
  private notLoaded: boolean = true;
  private loadingValue: number = 0;
  public listSelect: Array<String> = ["All records", "OK records", "Outdated records"];
  private selectedView: number = 0;
  private statuses: Status[] = [];



  ngOnInit(): void {
    console.log("View page load started");
    /*
    setTimeout(() => {
      this.ngOnInit();
  }, 10000);
  */
  
    this.closeDrawerOnInit();
    this.notLoaded = true;
    this.loadingValue = 0;
    
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
        this.loadingValue = 50; 
      }
    });

    setTimeout(() => {
      var tempRecords: Record[] = [];
      for (var i = 0; i < this.statuses.length;i++){
        for (var j = 0;j < this.records.length;j++){
          if (this.statuses[i].status == 'active'){
            if (this.statuses[i].id_cs == this.records[i][0]){
                tempRecords.push(this.records[i]);
                if (this.getStatus(this.records[i][0]) == 'OK'){
                  this.okRecords.push(this.records[i]);
                }else if (this.getStatus(this.records[i][0]) == 'Disconnected'){
                  this.okRecords.push(this.records[i]);
                }
                break;
            }
          }
        }
      }
      this.records = tempRecords;
      this.notLoaded = false;
      }, 2000);
  

  }

  ngOnDestroy(){
    stopMonitoring();
  }

  getStatus(date: Date){
    if (date){
      if (Date.now() - new Date(date).getTime() < 600000){
        return "OK";
      }else{
        return "Disconnected";
      }
    }else{
      return "No records";
    }
  }

  getSecondsFromLastRecord(date: Date){
    if (date){
      return Math.round((Date.now() - new Date(date).getTime())/1000);
    }else{
      return "Never";
    }
  }

  navigateOnDetails(id){
    this._router.navigate(['/view-page-details', {
      "id_cs": id
      }]);
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

  public onSelectedIndexChanged(args: EventData) {
    const picker = <ListPicker>args.object;
    if (picker.selectedIndex == 0){ 
        this.selectedView = 0;
    }else if (picker.selectedIndex == 1){ 
      this.selectedView = 1; 
    }else if (picker.selectedIndex == 2){
      this.selectedView = 2;
    }
}

}



