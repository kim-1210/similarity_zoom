"use strict";

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

}

module.exports = {
    show,
    func,
};