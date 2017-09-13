var async = require('async');
var uuid = require('uuid');
var utils = require('./utils');
var Model = require('./model');
var conf = require('../conf');
var N1qlQuery = require('couchbase').N1qlQuery;
//Data class for holding individual data fields by a given model id
//in containers
class DataEngine{
   constructor(bucket, ModelEngine){
      this.bucket = bucket;
      this.model = ModelEngine
   }

    //insert new data field 
    //@param 'model_id' the id of the model to be stored under
    //@param 'id' the user id associated with the data value
    //@param 'object' the data value itself for storing
   insert(model_id, object, id, cb){
      if(!id)         return cb({error: "No user provided"});
      this.model.get(model_id, (err, model) => {
         var model = model.model;
         var clean = utils.clean(model, object);
         var _id = uuid.v4();
         clean._id = {model: model_id, id: _id, u: id}
         this.bucket.insert(_id, clean, (err) => {
            cb(err, _id);
         });
      });
   }
   //removes given data value 
   //@param 'id' the user id associated with the desired data value
   remove(id, user_id, cb){
      var q = "DELETE FROM `" + conf.dataBucket + "` WHERE _id.u=$1 AND _id.id=$2";
      this.bucket.query(N1qlQuery.fromString(q), [user_id, id], (err, rows) => {
         cb(err, rows);
      });
   }
   //returns all the the data values under a given model
   //@param 'model' the structure wanting to be returned
   getAll(model, user_id, cb){
      var q = "SELECT * FROM `" + conf.dataBucket + "` WHERE _id.u=$1 AND _id.model=$2";
      this.bucket.query(N1qlQuery.fromString(q), [user_id, model], (err, rows) => {
         cb(err, rows.map((x) => x[conf.dataBucket]));
      });
   }
   //returns a given data object 
   //@param id: the id of the data object
   get(id, cb){
    console.log("GET:", id);
      this.bucket.get(id, (err, data) => {
         cb(err, data.value);
      });
   }
   //clones a given data object under a different id 
   //@param 'id' the id of the user asssociated with the data value to be cloned
   clone(id, cb){
      this.bucket.get(id, (err, data) => {
         
         var id = uuid.v4();
         var d = data.value;
         d._id = {
            model: d._id,
            id: id
         };

         this.bucket.insert(id, d, (err) => {
            cb(err, d);
         });
      });
   }
   //updates the object held under a given id number with the provided 
   //@param 'id' the user id associated with the old data value
   //@param 'object' the new value to replace the old   
   update(id, object, cb){
      console.log("UPDATE:", id);
      this.get(id, (err, data) => {
        this.model.get(data._id.model, (err, model) =>{
            var c = utils.clean(model.model, object);
            var clean = {
               ...data,
               ...c
            }
            this.bucket.replace(id, clean, (err) => {
               cb(err, clean);
            });
         });
      });
   }      
}

module.exports = DataEngine;
