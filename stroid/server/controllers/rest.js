(function() {
    function CRUD_Controller(ModelName) {
        var mongoose = require('mongoose')
        var Model = mongoose.model(ModelName)

        var sendResult = function(req, res, all){
            all = all ? all : true
            return function(err, result) {
                if (err) { res.json(err) } else {
                    if (result && !all) { res.json(result) } else {
                        Model.find({}, function(err, docs) {
                            res.json(err ? err : docs)
                        })
                    }
                }
            }
        }

        var process = function(req, res, all, model, funk, queryParams) {
            if (arguments > 6) {
                model[funk](queryParams, arguments[5], sendResult(req, res))
            } else {
                model[funk](queryParams, sendResult(req, res))
            }
        }

        function _fetch(req, res) { process(req, res, true, Model, 'find', {}) }
        function _fetchOne(req, res) { process(req, res, true, Model, 'findOne', {_id:req.params.id}) }
        function _create(req, res) { process(req, res, true, Model, 'create', req.body) }
        function _update(req, res) { process(req, res, true, Model, 'update', {_id:req.params.id}, req.body) }
        function _delete(req, res) { process(req, res, true, Model, 'findOneAndRemove', {_id:req.params.id}) }

       return {
            fetch: _fetch,
            fetchOne: _fetchOne,
            create: _create,
            update: _update,
            delete: _delete
        }
    }

    module.exports = function(ModelName) {
        return new CRUD_Controller(ModelName)
    }
})()
