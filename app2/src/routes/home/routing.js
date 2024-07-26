"use strict";

const express = require('express');
const router = express.Router();
const ctrl = require('./home.ctrl');

// SHOW
router.get('/', ctrl.show.login);
router.get('/register', ctrl.show.register);

router.get('/main/:id/:name/:gender', ctrl.show.main);
router.get('/chat_room', ctrl.show.chat_room);

// FUNC
router.post('/login_check', ctrl.func.login_check);
router.post('/get_register', ctrl.func.set_user_info);

module.exports = router;