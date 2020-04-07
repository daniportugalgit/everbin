const express = require('express')
const routes = express.Router()
const BinController = require('./controllers/BinController')
const BytesController = require('./controllers/BytesController')

routes.post('/bin/create', BinController.create)
routes.get('/bytes', BytesController.get)

module.exports = routes