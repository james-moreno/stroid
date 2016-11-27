(function() {
    var manager = require('../game/manager.js');
    var stage = new manager.Stage(5000,5000);

    var sockets = require('../sockets/sockets.js')()
    

    setInterval(function() {
        stage.updatePositions();//.bind(stage);
        sockets.pushStage(stage);
    }, 1000/30)

    class GameController {
        fetch(req, res) {
            return res.json({
                stage:stage
            })
        }
    }

    module.exports = new GameController()
})()
