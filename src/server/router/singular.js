var express = require('express')
var jsonPatch = require('fast-json-patch');

module.exports = function (db, name) {
  var router = express.Router()

  function show (req, res, next) {
    res.locals.data = db.get(name).value()
    next()
  }

  function create (req, res, next) {
    db.set(name, req.body).value()
    res.locals.data = db.get(name).value()
    res.status(201)
    next()
  }

  function update (req, res, next) {
    if (req.method === 'PUT') {
      db.set(name, req.body)
        .value()
    } else {
      var item = db.get(name).value();
      jsonPatch.apply(item, req.body.patches);
      db.set(name, item)
        .value()
    }

    res.locals.data = db.get(name).value()
    next()
  }

  router.route('/')
    .get(show)
    .post(create)
    .put(update)
    .patch(update)

  return router
}
