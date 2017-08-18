'use strict';

var uuid = require('uuid');
var couchbase = require('couchbase');
var N1qlQuery = couchbase.N1qlQuery;

class Rrome {
   constructor(bucket, bucketName){
      this.bucket = bucket;
      this.bucketName = bucketName;
   }

   getModels(cb){ 
      const query = N1qlQuery.fromString('SELECT * FROM `' + this.bucketName + '` WHERE type="model"');
      this.bucket.query(query, (err, rows) => {
         if(err) return cb(err);
         cb(null, rows.map((x) => { return x[this.bucketName] }));
      });
   }

   getModel(id, cb){
      this.bucket.get(id, (err, res) => {
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

      this.bucket.insert(id, model, (err, res) => {
         if(err) return cb(err);
         cb(null, id);
      });
   }


}

module.exports = (bucket, name) => {
   return new Rrome(bucket, name);
};
