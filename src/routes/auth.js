const express = require('express')
const router = express.Router()

const AuthController  = require('../controller/auth.controller')
const UsersController = require('../controller/users.controller')

// router.post('/register', authCtrl.verifyToken, AuthController.registerUser)
// router.post('/login', authCtrl.verifyToken, AuthController.loginUser)

module.exports = router
