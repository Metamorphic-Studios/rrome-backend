var couchbase = require('couchbase');

var cluster = new couchbase.Cluster('couchbase://108.61.96.44');
cluster.authenticate('test', 'testpassword');
var bucket = cluster.openBucket('rrome-test');
var rrome = require('./')(cluster);

var testModel = () => {
   rrome.addModel('test', {"Client No.": {type: "TEXT", id: "clientNo"}, "Client": {type: "FSelector", id: "client", foreignObject: "client"}, "Address": {type: "TEXT", id: "address"}}, ["clientNo"], (err, res) => {
      console.log(err, res);
   });
}

var testGet = () => {
   rrome.getModels((err, rows) => {
      console.log(err, rows.map((x) => x.model));
   });
}
rrome.on('ready', () => {
   rrome.insert('b680f44c-43c4-4a88-92d0-c0f3b1d2c599', {clientNo: "121", name: "HI", id: 'id'});
});
//testGet();

