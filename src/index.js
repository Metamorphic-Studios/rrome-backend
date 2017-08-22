'use strict';
var conf = require('../conf');
var async = require('async');
var EventEmitter = require('events');
var uuid = require('uuid');
var couchbase = require('couchbase');
var N1qlQuery = couchbase.N1qlQuery;
var utils = require('./utils');

class Rrome extends EventEmitter{
   constructor(cluster){
      super();

      this.cluster = cluster;
      this.buckets = {};

      this.initCluster((err, data) => {
         this.buckets.structures = data[0] 
         this.buckets.data = data[1] 
         
         this.emit('ready');
      });
   }

   //Data manipulation
   insertData(model_id, object, id, cb){
      console.log("INSERT FOR MODEL:", model_id);
      this.getModel(model_id, (err, model) => {
         var model = model.model;
         var clean = utils.clean(model, object);
         var _id = uuid.v4();
         clean._id = {model: model_id, id: _id, u: id}
         this.buckets.data.insert(_id, clean, (err) => {
            cb(err, _id);
         });
      });
   }
    
   deleteData(id, cb){
      this.buckets.data.delete(id, cb);
   }

   getDatas(model, user_id, cb){
      var q = "SELECT * FROM `" + conf.dataBucket + "` WHERE _id.u=$1 AND _id.model=$2";
      this.buckets.data.query(N1qlQuery.fromString(q), [user_id, model], (err, rows) => {
         cb(err, rows.map((x) => x[conf.dataBucket]));
      });
   }

   getData(id, cb){
    console.log("GET:", id);
      this.buckets.data.get(id, (err, data) => {
         cb(err, data.value);
      });
   }

   cloneData(id, cb){
      this.buckets.data.get(id, (err, data) => {
         var id = uuid.v4();
         var d = data.value;
         d._id = {
            model: d._id,
            id: id
         };

         this.buckets.data.insert(id, d, (err) => {
            cb(err, d);
         });
      });
   }

   updateData(id, object, cb){
      console.log("UPDATE:", id);
      this.getData(id, (err, data) => {
         this.getModel(data._id.model, (err, model) => {
            var c = utils.clean(model.model, object); 
            var clean = {
               ...data,
               ...c
            }
            
            this.buckets.data.replace(id, clean, (err) => {
               cb(err, clean);
            });
         });
      });
   }

   //Model manipulation
   getModels(models, cb){
      async.map(models, (item, cb) => {
         this.getModel(item, (err, val) => { 
            cb(err, val);
         });
      }, (err, res) => {
         cb(err, res);
      });
   }

   getModel(id, cb){
      this.buckets.structures.get(id, (err, res) => {
         if(err) return cb(err);
         cb(null, res.value);
      });
   }

   addModel(name, model, cb){
      var id = uuid.v4()
      var model = {
         id: id,
         name: name,
         model: model,
      }

      this.buckets.structures.insert(id, model, (err, res) => {
         if(err) return cb(err);
         cb(null, id);
      });
   }

   updateModel(id, struct, cb){
      this.getModel(id, (err, data) => {
         var model = {
            ...data,
            model: {
               ...struct,
               ...data.model
            } 
         }

         this.buckets.structures.replace(id, model, (err, res) => {
            cb(err, model);
         });
      });
   }

   deleteModel(id, cb){
      this.buckets.structures.delete(id, cb);
   }


   //Initialisation stuff
   initIndex(bucket, bucketName, cb){
      var q = N1qlQuery.fromString("CREATE PRIMARY INDEX ON " + bucketName + " USING GSI");
      bucket.query(q, (err, res) => { 
         cb(err, res);
      });
   }

   initCluster(cb){ 
      async.parallel([
         (cb) => {
            this.cluster.manager().createBucket(conf.structureBucket, {}, (err) => {
               let bucket = this.cluster.openBucket(conf.structureBucket); 
               if(err.statusCode != 400){
                  cb(err); 
               }
               this.initIndex(bucket, conf.structureBucket, () => {
                  cb(null, bucket);     
               });
            });
         }, 
         (cb) => {
            this.cluster.manager().createBucket(conf.dataBucket, {}, (err) => {
               let bucket = this.cluster.openBucket(conf.dataBucket); 
               if(err.statusCode != 400){
                  cb(err); 
               }
               this.initIndex(bucket, conf.dataBucket, () => {
                  cb(null, bucket);
               });
            });
         }
      ], (err, rows) => {
         cb(err, rows);
      });
   }
}

module.exports = (cluster) => {
   return new Rrome(cluster);
};
