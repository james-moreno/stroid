(function() {
    var gameManager = require('../game/manager.js');
    var s;

    class Socket {
        pushStage(stage) {
            this.io.sockets.emit('updated_positions', {stage:stage})
        }

        constructor(server) {
            this.io = require('socket.io')(server);

            this.io.on('connection', function(socket) {

                socket.on('start', function(data) {
                    console.log('omarrrrr',data,socket.id)
                });

                socket.on('launch', function(data) {
                    console.log(data, socket.id);
                });
            });
        }
    }

	module.exports = function(server) {
        s = s || new Socket(server);
        return s;
	}
})()
