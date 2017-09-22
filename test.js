var express = require('express');
var app = express();
var couchbase = require('couchbase');

var cluster = new couchbase.Cluster('couchbase://108.61.96.44');
cluster.authenticate('test', 'testpassword');
var rrome = require('./')({host: 'couchbase://108.61.96.44', user: 'test', password: 'testpassword'});
var rromeRouter = require('../rrome_express')(rrome);

rrome.on('ready', () => {
   app.use('/rrome', rromeRouter);
});

app.listen(3100);
//testGet();

