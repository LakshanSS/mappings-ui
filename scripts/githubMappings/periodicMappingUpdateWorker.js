/**
 * Created by ismaro3 on 29/06/17.
 * This module has functions for interacting with Github and uploading the ontology file/s.
 */
'use strict';
const Git = require('./git.js');
const Mongo = require('./mongo.js');
const Moment = require('moment');
const Rimraf = require('rimraf');
const Fs = require('fs');
const Mkdirp = require('mkdirp');
const Config = require('../../config');

const REPO_URL = Config.get('/githubMappings/repositoryURL');
const REPO_BRANCH = Config.get('/githubMappings/repositoryBranch');
const REPO_FOLDER = Config.get('/githubMappings/repositoryFolder');
const REPO_MAPPINGS_FOLDER = Config.get('/githubMappings/repositoryMappingsFolder');
const UPDATE_FREQUENCY_MINUTES = Config.get('/githubMappings/updateFrequencyMinutes');

const clearMappings = function (){

    return new Promise((resolve,reject) => {

        Rimraf(REPO_FOLDER + '/' + REPO_MAPPINGS_FOLDER, (err,res) => {

            if (err) {
                reject({ code: 'ERROR_CLEARING_MAPPINGS_DIR', msg: err });
            }

            Mkdirp(REPO_FOLDER + '/' + REPO_MAPPINGS_FOLDER, (err) => {

                if (err) {
                    reject({ code: 'ERROR_CLEARING_MAPPINGS_DIR', msg: err });
                }
                else {
                    resolve('Mappings directory cleared');
                }
            });
        });
    });

};


/**
 * SYNC FUNCTION
 */
const createMappingFile = function (dbItem){

    const templateName = dbItem._id.template;
    const templateLang = dbItem._id.lang;
    const rml = dbItem.rml;
    const langDirectory = REPO_FOLDER + '/' + REPO_MAPPINGS_FOLDER + '/' + templateLang;
    const fileName = 'Mapping_' + templateLang + ':' + templateName + '.ttl';
    if (!Fs.existsSync(langDirectory)){
        Mkdirp.sync(langDirectory);
    }
    Fs.writeFileSync(langDirectory  + '/' + fileName,rml);


};


let repo;
let updateDate;
const updateGithubMappings = function () {

    updateDate = Moment(new Date()).format('DD/MM hh:mm:ss');
    console.log('* Starting Github mappings update at ' + updateDate);
    Git.startRepository(REPO_URL,REPO_BRANCH,REPO_FOLDER)
        .then((re) => {



            repo = re;
            return clearMappings();
        })
        .then(() => {

            console.log('\t[INFO] Mappings cleared');
            return  Mongo.getMappings();
        })
        .then( (res) => {

            return new Promise((resolve,reject) => {

                res.each( (err,item) => {

                    if (!err && item){
                        createMappingFile(item);
                    }
                    else if (err){
                        reject(err);
                    }

                    if (item === null){ //Cursor has finished
                        resolve('OK');
                    }

                });
            });

        })
        .then((res) => { //As createMappingfile is sync, for sure all files will be created at this point

            console.log('\t[INFO] Files created.');
            return Git.add(repo,REPO_FOLDER + '/' +  REPO_MAPPINGS_FOLDER);

        })
        .then((res) => { //As createMappingfile is sync, for sure all files will be created at this point

            console.log('\t[INFO] Files added to stage.');
            return Git.commit(repo,'Changes as ' + updateDate);

        })
        .then((res) => { //As createMappingfile is sync, for sure all files will be created at this point

            console.log('\t[INFO] Files commited.');
            return Git.push(repo,0,10);

        })
        .then((res) => { //As createMappingfile is sync, for sure all files will be created at this point

            console.log('\t[INFO] Files pushed.');
            console.log('\t[INFO] Finished successfuly.');
        })
        .catch((err) => {

            if (err.code){
                console.log('\t[ERROR] ' + err.code);
                console.log(err.msg);
            }
            else {
                console.log(err);
            }
        });
};

const start = function (){

    updateGithubMappings();
    setInterval(updateGithubMappings,UPDATE_FREQUENCY_MINUTES * 60 * 1000);

};


module.exports = {
    start
};

