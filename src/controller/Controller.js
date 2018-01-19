module.exports = name => {
  const Model = require(`../models/${name}.model`)

  const errorHandler = next => {
    return error => {
      console.error(error)

      const status = 400
      const message = `Please check your request and try again`
      next({ status, message })
    }
  }

  class Controller {
    static exists (req, res, next) {
      const status = 404
      const message = `ID of ${req.params.id} not found`

      Model.show(req.params.id)
      .then(response => response ? next() : next({ status, message }))
    }

    static index (req, res, next) {
      Model.index()
      .then(response => res.json({ 
        userType: res.userType,
        name: response }))
      .catch(errorHandler(next))
    }

    static show(req, res, next) {
      Model.show(req.params.id)
        .then(response => res.json({ name: response }))
    }

    static create(req, res, next) {
      Model.create(req.body)
        .then(response => res.json({ name: response }))
    }

    static update(req, res, next) {
      Model.update(req.params.id, req.body)
        .then(response => res.json({ name: response }))
    }

    static delete(req, res, next) {
      Model.delete(req.params.id)
        .then(response => res.json({ name: response }))
    }
  }

  return Controller
}