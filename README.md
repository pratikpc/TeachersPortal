# Teacher's Portal
A Simple Web App to simplify the management of a teacher's own educational and publication records on a simple server.

## Table of Contents
* [Description](https://github.com/ejson03/TeachersPortal#description)
* [Installation](https://github.com/ejson03/TeachersPortal#installation)
  * [Prerequisites](https://github.com/ejson03/TeachersPortal#prerequisites)
  * [Instructions](https://github.com/ejson03/TeachersPortal#instructions)
* [Usage](https://github.com/ejson03/TeachersPortal#usage)


## Description
An Express EJS web application wher college authorities ca manage teachers and generate summarie of techer activities over the academic year. Teachers can maintain their publications, conferences and researches in an organized manner.

## Installation
### Prerequisites
* [Node.JS](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

  By Default configured with Username = postgres and Password = Postgres.
  
  Use this to [setup a default PostgreSQL environment](https://github.com/pratikpc/Docker-Common-Configs/blob/master/Postgres%20DockerStarter.bat)
  
### Instructions
Clone the repository
```
git clone https://github.com/pratikpc/TeachersPortal
```
Install and Build
```
npm install
npm run build
```

## Usage
Start the webapp
```
npm run deploy
``` 
Open a browser and go to [http://localhost:8000](http://localhost:8000)
