# DBpedia RML Mappings UI
[![Build Status](https://travis-ci.org/dbpedia/mappings-ui.svg?branch=master)](https://travis-ci.org/dbpedia/mappings-ui)
[![Heroku](https://heroku-badge.herokuapp.com/?app=mappings-ui)](https://mappings-ui.herokuapp.com)

Web application (front and back-end) that provides a user-friendly interface so the DBPedia community can easily view, create and administrate DBPedia mapping rules using RML. It includes users and groups management, mapping list, a powerful RML editor, and integration with the DBPedia Extraction Framework to provide mapping stats, test extractions and many powerful features.

Developed under the ["DBPedia Mappings Front-end Administration"](https://docs.google.com/document/d/10ylUFwgj-i0BxDQ9LAbHkpanbNr9TFklgMnejSIXISg/edit?usp=sharing) GSoC 2017 project.

Based on Aqua Framework.



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
Edit the file with your own configuration parameters. Please read the [`ENVIRONMENT VARIABLES`](https://github.com/dbpedia/mappings-ui/wiki/%5BINFO%5D-Environment-variables) wiki page to obtain more details.

After that, edit the `config.json` file to edit the rest of configuration parameters.

```bash
$ vi config.json
```
 Edit only those whose value do not start with `process.env`. Also, take into account that if you are going to use docker, it will run in production mode, so edit always the `production` configuration values. Please read the [`CONFIG FILE`](https://github.com/dbpedia/mappings-ui/wiki/%5BINFO%5D-Config.js-file) wiki page to obtain more details.
 
 ## Github sync configuration
 
The Mappings UI is capable of synchronizing the Mappings with a github repository (two-way) and integrate with a WebProtege instance to edit an ontology and push it to a Github repository. If you want to know more details and configure it, please read the [Pushing mappings and ontology to Github](https://github.com/dbpedia/mappings-ui/wiki/%5BINFO%5D-Pushing-mappings-and-ontology-to-Github) wiki page.
 
 
 ## Running using Docker (Recommended)
 
 To run in Docker, just make sure that you have `docker` and `docker-compose` installed, and run:
 
 ```bash
$ sudo docker-compose build
$ sudo docker-compose up
```

That's it. You can access the interface via `http://localhost:8000` and the MongoDB instance on your local port `27018`. See the _Default accounts_ section below to obtain login details.

## Running using your local system

To run in your own system, make sure that you have `node` (v6), `npm` and `mongodb` installed. Then, follow these steps:

 ```bash
$ npm install
$ sudo npm install -g gulp  #You need to install gulp globally also
$ gulp build
$ bash start.sh
```
By default, it is run on development mode. If you want to run the system in production mode, set NODE_ENV variable to production:
 ```bash
$ export NODE_ENV=production
```

That's it. You can access the interface via `http://localhost:8000`. See the _Default accounts_ section below to obtain login details.

## Running an Extraction Framework instance

A [DBpedia Extraction Framework](https://github.com/dbpedia/extraction-framework) instance is needed to have full functionality (ontology search, validation,...). This instance can be either hosted anywhere else, or in the same host as the Mappings UI. Just make sure that the `EXTRACTION_FRAMEWORK_URL` variable in your .env file points to it.

To run an instance, just follow these steps:
 ```bash
#Install Extraction Framework
$ mkdir ef
$ cd ef
$ wget https://raw.githubusercontent.com/dbpedia/extraction-framework/rml/Dockerfile
$ sudo docker build -t ef .

#Run Extraction Framework. Execute this each time you want to run it.
$ sudo docker run -p 9999:9999 ef
```

## Default accounts
The first time that the system is executed, some default accounts are created:

| user type                            | username | password |
|:------------------------------ |:-------- |:-------- |
| Administrator | root     | dbpedia     |
| Regular | user     | dbpedia     |

Please, change those passwords ASAP.

