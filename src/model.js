var async = require('async');
var conf = require('../conf');
var uuid = require('uuid');
var N1qlQuery = require('couchbase').N1qlQuery;

//a container class for accessing and managing different models
class ModelEngine{
   constructor(bucket){
      this.bucket = bucket;
   }

   
   //lists all currently stored models 
   listAll(cb){
      var q = "SELECT * FROM `" + conf.structureBucket + "`";
      this.bucket.query(N1qlQuery.fromString(q), (err, rows) => {
         cb(err, rows.map((x) => x[conf.structureBucket]));
      });
   }
   //returs all given models specified
   //@paran 'models' and array of uuid's of the models desired
   getModels(models, cb){
      async.map(models, (item, cb) => {
         this.get(item, (err, val) => { 
            cb(err, val);
         });
      }, (err, res) => {
         var ret_models = models.map((x) => {
            for(var i = 0; i < res.length; i++){
               if(res[i].id == x){
                  return res[i];
               }
            }
         });
         cb(err, ret_models);
      });
   }
   //returns a given model type
   //@param 'id' the id number of the desired model
   get(id, cb){
      this.bucket.get(id, (err, res) => {
         if(err) return cb(err);
         cb(null, res.value);
      });
   }
   //adds a model to this engine
   //@param 'name' the name of the new model
   //@param 'model' the new model itself
   add(name, model, cb){
      var id = uuid.v4()
      var model = {
         id: id,
         name: name,
         model: model,
      }

      this.bucket.insert(id, model, (err, res) => {
         if(err) return cb(err);
         cb(null, id);
      });
   }
   //updates a model with a new value
   //@param 'id' the id of the model
   //@param 'struct' the changed structure
   update(id, struct, cb){
      this.get(id, (err, data) => {
         var model = {
            ...data,
            model:struct
         }
         this.bucket.upsert(id, model, (err) => {
            cb(err, model);
         });
      });
    }
  }

module.exports = ModelEngine; 

