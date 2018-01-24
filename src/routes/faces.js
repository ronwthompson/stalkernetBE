const express = require('express');
const router = express.Router();
const ctrl = require('../controller/faces.controller')

router.post('/instagram/:username', ctrl.instagram)

module.exports = router