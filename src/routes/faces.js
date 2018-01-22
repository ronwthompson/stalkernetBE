const express = require('express');
const router = express.Router();
const ctrl = require('../controller/faces.controller')

router.post('/:username', ctrl.instagram)

module.exports = router