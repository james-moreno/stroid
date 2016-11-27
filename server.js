(function() {
    var bp = require('body-parser');
    var path = require('path');
    var port = 8080;
    var express= require('express');
    var app = express()
    var server = require('http').Server(app)

    app.use(express.static(path.join(__dirname, './client')));
    app.use(express.static(path.join(__dirname, './bower_components')));
    app.use(express.static(path.join(__dirname, './node_modules')));
    app.use(express.static(path.join(__dirname, './server')));

//        require('./server/config/mongoose.js')
    require('./server/sockets/sockets.js')(server)
    require('./server/config/routes.js')(app)

    server.listen(port, function() {
        console.log('Node server on port',port);
    });
})()
