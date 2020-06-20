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
