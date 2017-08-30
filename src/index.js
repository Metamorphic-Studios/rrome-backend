'use strict';
var conf = require('../conf');
var async = require('async');
var EventEmitter = require('events');
var uuid = require('uuid');
var couchbase = require('couchbase');
var N1qlQuery = couchbase.N1qlQuery;
var utils = require('./utils');
var DataEngine = require('./data.js');
var ModelEngine = require('./model.js');
class Rrome extends EventEmitter{
   constructor(cluster){
      super();
      
      this.cluster = cluster;
      this.buckets = {};

      this.initCluster((err, data) => {
         this.model = new ModelEngine(data[0])
         this.data = new DataEngine(data[1], this.model) 
         this.emit('ready');
      });
   }

   //Initialisation stuff
   initIndex(bucket, bucketName, cb){
      var q = "CREATE PRIMARY INDEX ON " + bucketName + " USING GSI";
      bucket.query(N1qlQuery.fromString(q), (err, res) => { 
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
