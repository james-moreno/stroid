(function(app) {
    var game = require('../controllers/game.js');

    module.exports = function(app) {
        app.get('/stage', game.fetch);
    }
})()
