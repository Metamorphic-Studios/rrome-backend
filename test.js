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
      console.log(err, rows);
   });
}
rrome.on('ready', () => {

   rrome.updateModel('700f66d7-c33d-48b3-b691-c26aebb12456', {"Past Address": {type: "TEXT", id: "pastAddress"}}, ["pastAddress"], (err, data) => {
      console.log(err, data);
   });
   rrome.updateData('67a34ffa-c714-4cdc-9aeb-45147d8b2501', {clientNo: 1111}, (err, data) => {

   });

});
//testGet();

