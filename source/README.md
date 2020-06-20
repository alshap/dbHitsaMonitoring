# Application quick start

Quick start is possible when node js, all sdks and needed components are already installed.
If something went wrong check errors in console.

1. Clone repository
```
>https://github.com/alshap/dbHitsaMonitoring
```
2. Go forward to source folder
```
>cd source
```
3.Install packages via npm
```
>npm install
```
4. Add platform
```
>tns platform add android
```
6. Add web files to your web server

7. Run project on device
```
>tns run android
```

# Application Description

# Intro

Database monitoring application has 3 pages: 
1. Main page with settings. There is rebuild sensors status sqlite database function. Use it if application do not see all sensors.
2. Records page to see last records in database from each sensor. Has got 3 options: show all records, show correct records and show outdated records. Can see only records with active status.
3. Sensors page with all sensors list and ability to change sensor status to active/unactive. 

## Main sections

There are some things what it is needed to know for project realisation. There will be given some explanation for each of them.
Main themes:
1. Permissions
2. Sidedraw menu
3. SQLite database
4. HTTP module
5. Activiry indicator and progress

## Permissions

Application on each page always monitors internet connection. How it is implemented is shown on main.page.component

**.ts**
```
private connectionTypeString = "No Internet connection";
private isInternetConnection: boolean;

const type = getConnectionType();
this.isInternetConnection = this.checkConnection(type);
    
startMonitoring((newConnectionType) => {
      if (newConnectionType == connectionType.none){
        this.isInternetConnection = false;
      }else{
        this.isInternetConnection = true;
      }
checkConnection(type){  
    if (type == connectionType.none){
      return false;
    }else{
      return true;
    }
  }   
```

**.html**
```
<Stacklayout>
    <Label text="{{ connectionTypeString }}" *ngIf="!isInternetConnection" class="prmInternet"></Label>
</Stacklayout>
```

If no connection to the internet then a notification appears at the top of the page. That helps to understand sometimes why application is not working and user does not see any data.

To check an internet connection also should be added permission in \App_Resources\Android\src\main\AndroidManifest.xml

In this application are 4 user-permissions
```
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.INTERNET"/>
```

## Sidedrawer menu

Sidedrawer is implemented using RadSideDrawer module.

More about this module in official documentation https://docs.nativescript.org/angular/ui/ng-components/ng-sidedrawer/getting-started

SideDrawer code is located in app.component and then can be called by left scrolling from any page.

**.html**
```
<RadSideDrawer tkExampleTitle tkToggleNavButton>
    <GridLayout tkDrawerContent rows="56, *" class="sideStackLayout">
        <StackLayout class="sideTitleStackLayout">
            <Label text="Navigation Menu"></Label>
        </StackLayout>
        <ScrollView row="1">
            <StackLayout class="sideStackLayout">
                <Label text="Main page" [nsRouterLink]="['/main-page']" class="sideLabel sideLightGrayLabel"></Label>
                <Label text="Records view" [nsRouterLink]="['/view-page']" class="sideLabel sideLightGrayLabel"></Label>
                <Label text="Sensors view" [nsRouterLink]="['/sensors-view-page']" class="sideLabel sideLightGrayLabel"></Label>
                <Label text="About" [nsRouterLink]="['/about-page']" class="sideLabel sideLightGrayLabel"></Label>
                <Label text="Close Drawer" color="lightgray" padding="10" style="text-align: center" (tap)="onCloseDrawerTap()"></Label>
            </StackLayout>
        </ScrollView>
    </GridLayout>

    <page-router-outlet tkMainContent></page-router-outlet>
</RadSideDrawer>
```
This drawer should contain all neccessary links to navigate

**.ts**
```
@ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnInit() {
      }

    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }
```
openDrawer() and onCloseDrawerTap() function to open and close drawer.

Easy to open drawer on any page using buttons as shown on main.component page
**.html**
```
<Actionitem text="Menu" android.position="actionBar" (tap)="onDrawerButtonTap()"></Actionitem>
```
Button with function calling
**.ts**
```

ngOnInit(): void {
    this.closeDrawerOnInit();
    ...
  }
onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeDrawerOnInit(){
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }
```
closeDrawerOnInit we use in ngOnInit to close drawer when page is loaded. By calling function onDrawerButtonTap drawer is opening.

## SQLite database

SQLite db is using to store sensors statuses. In application is functional to show only these records from sensors that have status "Active" and user can specify by himself which sensors are active.

SQLite service code is located in \src\app\services\sqlite.service. Here are all necessary functions for this functional implementation

SQLite data is implemented in sensors-view-page.component to change status to active/unactive.

Very important to understand how SQLite is implemented on view-page.component to compare last records array with sqlite active sensors
**.ts**
```
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
```
On this piece of code Records from backend are comparing with statuses from sqlite by sensor id. If status is active then records are divided into "OK" records and "Outdated" records.

## HTTP Module

HTTP module provides communication with backend in src/app/services/database.service
```
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
```
Implementation is quite easy. Application just take JSON information from web server and forms from them list matching necessary interface.
Then we can use these data on any page.

## Activity indicator and Progress

In application is implemented loading animation to give application a time to load all necessary data.

**.html**
```
<Stacklayout *ngIf="notLoaded">
    <Progress class="m-20" value="{{ loadingValue }}"></Progress>
    <ActivityIndicator busy="true"></ActivityIndicator>
</Stacklayout>
```
Animation is shown while notLoaded variable is true. loadingValue shows status from 0 to 100.
