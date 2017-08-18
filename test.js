var couchbase = require('couchbase');

var cluster = new couchbase.Cluster('couchbase://108.61.96.44');
cluster.authenticate('test', 'testpassword');
var bucket = cluster.openBucket('rrome-test');

var rrome = require('./')(bucket);

rrome.addModel('test', {"Client No.": {type: "TEXT", id: "clientNo"}, "Client": {type: "FSelector", id: "client", foreignObject: "client"}, "Address": {type: "TEXT", id: "address"}}, ["clientNo"], (err, res) => {
   console.log(err, res);
   rrome.getModels((_err, rows) => {
      console.log(_err);
      console.log(rows);
   });
});
