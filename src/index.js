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
   constructor(opts){
      super(); 

      this.cluster = new couchbase.Cluster(opts.host);
      this.cluster.authenticate(opts.user, opts.password);
      this.buckets = {};

      this.initCluster((err, data) => {
         if(err) console.log("Error initialising couchbase buckets");
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
               }else{
                  this.initIndex(bucket, conf.structureBucket, () => {
                     cb(null, bucket);     
                  });
               }
            });
         }, 
         (cb) => {
            this.cluster.manager().createBucket(conf.dataBucket, {}, (err) => {
               let bucket = this.cluster.openBucket(conf.dataBucket); 
               if(err.statusCode != 400){
                  cb(err); 
               }else{
                  this.initIndex(bucket, conf.dataBucket, () => {
                     cb(null, bucket);
                  });
               }
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
