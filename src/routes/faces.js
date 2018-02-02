const express = require('express');
const router = express.Router();
const ctrl = require('../controller/faces.controller')

router.get('/instagram/:username', ctrl.getInfo)
router.get('/instagram/all/:username', ctrl.getAllInfo)
router.post('/instagram/:username', ctrl.instagram)
router.post('/instagram/addother/:username', ctrl.addOther)
router.post('/quiz/:username', ctrl.quizFinished)

module.exports = router