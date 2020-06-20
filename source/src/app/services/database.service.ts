import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Sensor } from '../interfaces/Sensor';
import { Record } from '../interfaces/Record';

@Injectable()
export class DatabaseService {

  constructor(private http: HttpClient) {}
  
  getSensors(){
    let sensors_Url = "http://dev.vk.edu.ee/~t178546/requests.php?request=sensors";
    return this.http.get<Sensor[]>(sensors_Url);    
     
  }
  

  getRecords(){
    let records_Url = "http://dev.vk.edu.ee/~t178546/requests.php?request=records";
    return this.http.get<Record[]>(records_Url);
  }

  getCsDetails(id){
    let CSDetails_Url = "http://dev.vk.edu.ee/~t178546/requests.php?cs=" + String(id);
    return this.http.get(CSDetails_Url);
  }
    

  }
