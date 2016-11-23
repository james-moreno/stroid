(function() {
    var gameManager = require('../game/manager.js')

	module.exports = function(server) {
		var io = require('socket.io')(server);

		io.on('connection', function(socket) {
            socket.on('start', function(data) {
                console.log('omarrrrr',data,socket.id)
            });

			socket.on('launch', function(data) {
				console.log(data, socket.id);
			});
		});
	}
})()
