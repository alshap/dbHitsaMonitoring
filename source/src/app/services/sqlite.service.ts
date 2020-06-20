import { Injectable } from '@angular/core';
var Sqlite = require("nativescript-sqlite");
import { Status } from '../interfaces/Status';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  private database: any;
  private controllerStatus: Array<Status>;

  public constructor(){
      (new Sqlite("persist.sqlite")).then(db => {
          db.execSQL("CREATE TABLE IF NOT EXISTS persist(id INTEGER PRIMARY KEY AUTOINCREMENT, id_cs INTEGER, status TEXT)").then(id => {
              this.database = db;
              this.fetch();
          }, error => {
              console.log("CREATE TABLE ERROR: ", error);
          });
      }, error => {
          console.log("OPEN DB ERROR: ", error);
      });
    }

  public insert(id_cs) {   
    if (id_cs){
        let data = [Number(id_cs), "active"];
        this.database.execSQL("INSERT INTO persist (id_cs, status) VALUES (?, ?)", data).then(id => {
            this.fetch();
        }, error => {
            console.log("INSERT ERROR: ", error);
        });
      }else{
        //pass
      }
    }

  public fetch() {
      var temp: Array<Status> = [];
      this.database.all("SELECT * from persist").then(rows => {
          for(let row in rows) {
                temp.push({
                  id: rows[row][0],
                  id_cs: rows[row][1],
                  status: rows[row][2]
              });      
          }
      });
      this.controllerStatus = temp;
    }

  async getCS(id): Promise<Status>{
    var controllerStatus: Status;
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(id);
      }, 300);
      
    });
    promise.then((id) => {
      this.database.get("SELECT * from persist WHERE id_cs = (?)",[id]).then(data => {
          controllerStatus = {
              "id": data[0],
              "id_cs": data[1],
              "status": data[2],
          };
      }, error => console.log(error));
    });
    return controllerStatus;
  }

  public vacuum() {
      this.database.execSQL('DELETE FROM persist');
      //this.database.execSQL('VACUUM persist');
      this.database.execSQL('UPDATE sqlite_sequence SET seq = 0 WHERE name = "persist"');
      this.fetch();
    }

  public getAllCS() {
      return this.controllerStatus;
    }

  async checkExists(id_cs){
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(id_cs);
      }, 300);
      
    })
    promise.then((id) => {
      this.database.all('SELECT * FROM persist WHERE id_cs = ? limit 1', [id]).then(data => {
        if (data.length > 0){
          //pass
        }else{
          this.insert(id);
        }
    });
   
    });
  }

  public changeStatus(id_cs, status){
    if (status == 'active'){
      this.database.execSQL('UPDATE persist SET status = "unactive" WHERE id_cs = ?', [id_cs]);
    }else if (status == 'unactive'){
      this.database.execSQL('UPDATE persist SET status = "active" WHERE id_cs = ?', [id_cs]);
    }
    this.fetch();
  }
}
