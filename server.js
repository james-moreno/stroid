var bp = require('body-parser');
var path = require('path');
var port = 8080;
var express= require('express');
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './bower_components')));
app.use(express.static(path.join(__dirname, './node_modules')));

server.listen(port, function() {
    console.log('Node server on port',port);
});

io.on('connection', function(socket) {
    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function(data) {
        console.log(data, socket.id);
    });

    socket.on('launch', function(data) {
        console.log(data, socket.id);
    });
});
