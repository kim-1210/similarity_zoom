"use strict";

const express = require('express');
const router = express.Router();
const ctrl = require('./home.ctrl');

// SHOW
router.get('/', ctrl.show.login);
router.get('/register', ctrl.show.register);

router.post('/main', ctrl.show.main);
router.post('/chat_room', ctrl.show.chat_room);

// FUNC


module.exports = router;