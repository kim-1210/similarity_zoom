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
router.post('/login_check', ctrl.func.login_check);
router.post('/get_register', ctrl.func.set_user_info);

module.exports = router;