'use strict';
var conf = require('../conf');
var async = require('async');
var EventEmitter = require('events');
var uuid = require('uuid');
var couchbase = require('couchbase');
var N1qlQuery = couchbase.N1qlQuery;

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

   insert(id, object, cb){
      this.getModel(id, (err, model) => {
         var model = model.model;
         var clean = {};
         for(var k in model){
            if(object[model[k].id]){ 
               clean[model[k].id] = object[model[k].id];       
            }
         }
         console.log(clean);
      });
   }

   getModels(cb){ 
      const query = N1qlQuery.fromString('SELECT * FROM `' + conf.structureBucket + '` WHERE type="model"');
      this.buckets.structures.query(query, (err, rows) => {
         if(err) return cb(err);
         cb(null, rows.map((x) => { return x[conf.structureBucket] }));
      });
   }

   getModel(id, cb){
      this.buckets.structures.get(id, (err, res) => {
         if(err) return cb(err);
         cb(null, res.value);
      });
   }

   addModel(name, model, display_keys, cb){
      var id = uuid.v4()
      var model = {
         id: id,
         type: "model",
         name: name,
         model: model,
         display_keys: display_keys
      }

      this.buckets.structures.insert(id, model, (err, res) => {
         if(err) return cb(err);
         cb(null, id);
      });
   }


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
               this.initIndex(bucket, conf.structureBucket, () => {
                  cb(err, bucket);     
               });
            });
         }, 
         (cb) => {
            this.cluster.manager().createBucket(conf.dataBucket, {}, (err) => {
               let bucket = this.cluster.openBucket(conf.dataBucket);
               this.initIndex(bucket, conf.dataBucket, () => {
                  cb(err, bucket);
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
