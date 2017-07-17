/**
 * Created by ismaro3 on 17/07/17.
 */
'use strict';
const MongoClient = require('mongodb').MongoClient;
const Config = require('../../config');


const URI = Config.get('/hapiMongoModels/mongodb/uri');

let database;
/**
 * Returns a database db object and the webprotege dbpedia project _id.
 */
const connectToDB = function (){

    if (database){
        return Promise.resolve(database);
    }

    //Returns a promise when everything is finished
    return MongoClient.connect(URI)
        .then((db) => {

            database = db; //Store database object
            return db;

        });

};

const getMappings = function (){

    return connectToDB()
        .then((db) => {

            return db.collection('mappings').find();

        })
        .catch((err) => {

            console.log(err);
        });

};

module.exports = {

    getMappings
};
