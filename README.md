# DBpedia RML Mappings UI

Developed under the "DBPedia Mappings Front-end Administration" GSoC 2017 project.

Please go to the Wiki for more information.


Based on Aqua Framework.

[![Build Status](https://travis-ci.org/dbpedia/mappings-ui.svg?branch=master)](https://travis-ci.org/dbpedia/mappings-ui)
[![Heroku](https://heroku-badge.herokuapp.com/?app=mappings-ui)](https://mappings-ui.herokuapp.com)

## Installation

The Mappings UI can be run either using **Docker (Recommended)**  or your local system. But, before running, some steps have to be followed:

First of all, clone the project and enter into its directory: 
```bash
$ git clone https://github.com/dbpedia/mappings-ui
$ cd mappings-ui
```
Then, copy the sample `.env-sample` file into `.env.` That file will be used to store the secrets of the app. 
```bash
$ cp .env-sample .env
$ vi .env
```
Edit the file with your own configuration parameters. If you need more help, please see the [`ENVIRONMENT VARIABLES`](https://github.com/dbpedia/mappings-ui/wiki/%5BINFO%5D-Environment-variables) wiki page.

After that, edit the `config.json` file to edit the rest of configuration parameters.

```bash
$ vi config.json
```
 Edit only those whose value do not start with `process.env`. Also, take into account that if you are going to use docker, it will run in production mode, so edit always the `production` configuration values. If you need more help, please see the `CONFIG FILE` wiki page.
 
 ## Running using Docker (Recommended)
 
 To run in Docker, just make that you have `docker-compose` installed, and run:
 
 ```bash
$ sudo docker-compose buld
$ sudo docker-compose up
```

That's it. You can access the interface via `http://localhost:8000` and the MongoDB instance on your local port `27018`. See the _Default accounts_ section below to obtain login details.

## Running using your local system

To run in your own system, make sure that you have `node` (v6), `npm` and `mongodb` installed. Then, follow these steps:

 ```bash
$ npm install
$ bash start.sh
```
By default, it is run on development mode. If you want to run the system in production mode, set NODE_ENV variable to production:
 ```bash
$ export NODE_ENV=production
```

That's it. You can access the interface via `http://localhost:8000`. See the _Default accounts_ section below to obtain login details.

## Default accounts
The first time that the system is executed, some default accounts are created:

| user type                            | username | password |
|:------------------------------ |:-------- |:-------- |
| Administrator | root     | dbpedia     |
| Regular | user     | dbpedia     |

Please, change those password ASAP.

