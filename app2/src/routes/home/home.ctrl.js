"use strict";

const { user_info, friend_info } = require("../../models/database");

const show = {
    main : (req, res) =>{
        res.render('home/main');
    },
    login : (req, res) =>{
        res.render('home/login');
    },
    chat_room : (req, res) =>{
        res.render('home/chat_room');
    },
    register : (req, res) =>{
        res.render('home/register');
    },
}

const func = {
    login_check: async (req, res) => {
        try {
            const rows = await user_info.get_login(req.body);
            if (rows.length > 0) {
                return res.json({ result: true });
            } else {
                return res.json({ result: false, message : '로그인에 실패했습니다.' });
            }
        } catch (error) {
            res.status(500).json({ result: false, message: error.message });
        }
    },
    set_user_info: async (req, res) => {
        try {
            const result = await user_info.set_user_info(req.body);
            return res.json(result);
        } catch (error) {
            res.status(500).json({ result: false, message: error.message });
        }
    }
}

module.exports = {
    show,
    func,
};