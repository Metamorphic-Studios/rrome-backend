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
   rrome.getModels(['f0e49e9d-7073-404b-95c0-e25ddbcbf5ca', '1d2b4c75-bacb-4826-8bed-f35985287c08'], (err, models) => {
      console.log(err, models);
   });
});
//testGet();

