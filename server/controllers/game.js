(function() {
    var manager = require('../game/manager.js');

    var stage = new manager.Stage(5000,5000);

    setInterval(stage.updatePositions.bind(stage), 1000/60)

    class GameController {
        fetch(req, res) {

            return res.json({
                stage:stage
            })
        }
    }

    module.exports = new GameController()
})()
