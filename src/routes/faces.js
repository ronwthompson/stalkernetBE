const express = require('express');
const router = express.Router();
const ctrl = require('../controller/faces.controller')

router.post('/:username', ctrl.getAndRecognizeFaces)

module.exports = router