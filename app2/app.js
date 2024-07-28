"use strict";

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const home = require('./src/routes/home/routing');
//routing을 하지 않을시 index.js를 읽을려고 함
app.use('/', home);

app.set('views', './src/views');
app.set('view engine', "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(`${__dirname}/src/public`));

var server = http.createServer(app);

module.exports = server;