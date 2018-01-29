const express = require('express');
const router = express.Router();
const ctrl = require('../controller/faces.controller')

router.post('/instagram/:username', ctrl.instagram)
router.post('/quiz/:username', ctrl.quizFinished)

module.exports = router