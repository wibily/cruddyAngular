var express = require('express');
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser());

var dataStore = [];

app.get('/rest/assets', function (req, res) {

    res.send(dataStore.filter(function(item){
        return item;
    }));
});

app.post('/rest/assets', function (req, res) {
    if (!req.body || !req.body.key || !req.body.value) {
        return res.status(400).send('Request body not {"key":"key", "value": "value"}');
    }
    var obj = {
        "id": dataStore.length,
        "key": req.body.key,
        "value": req.body.value
    };
    dataStore.push(obj);
    res.location('/rest/assets/' + obj.id).sendStatus(201);
});

app.delete('/rest/assets', function (req, res) {
    dataStore = [];
    res.sendStatus(204);
});

app.get('/rest/assets/:id', function (req, res) {
    if (!dataStore[req.params.id]) {
        return res.sendStatus(404);
    }
    res.send(dataStore[req.params.id]);
});

app.put('/rest/assets/:id', function (req, res) {
    if (!dataStore[req.params.id]) {
        return res.sendStatus(404);
    }

    if (!req.body || !req.body.key || !req.body.value) {
        return res.status(400).send('Request body not {"key":"key", "value": "value"}');
    }

    var obj = {
        "id": req.params.id,
        "key": req.body.key,
        "value": req.body.value
    };
    dataStore[req.params.id] = obj;
    res.send(obj);
});

app.delete('/rest/assets/:id', function (req, res) {
    if (dataStore[req.params.id]) {
        dataStore[req.params.id] = undefined;
    }
    res.sendStatus(204);
});

var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('CRUD app listening at http://%s:%s', host, port);
});