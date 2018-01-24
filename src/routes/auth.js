const express = require('express')
const router = express.Router()

const AuthController  = require('../controller/auth.controller')
const UsersController = require('../controller/users.controller')

router.post('/register', AuthController.verifyToken, AuthController.checkExistence, UsersController.create)
router.post('/login', AuthController.verifyToken, AuthController.checkLogin, AuthController.sendToken)

module.exports = router
