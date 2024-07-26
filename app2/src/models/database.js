"use strict";

const mysql = require('mysql2');
const fs = require('fs');
const bcrypt = require('bcrypt');
const dbConfig = JSON.parse(fs.readFileSync('src/models/dbConfig.json', 'utf8'));
const connect = mysql.createConnection(dbConfig);

connect.connect();

class user_info {

    static async get_login(body) { //login은 id와 pw
        return new Promise((resolve, reject) => {
            const { id, pw} = body;
            connect.query(`SELECT * FROM user_info WHERE ID = ?`, [id], async (error, rows) => {
                if (error) {return reject(error);}
                if (rows.length > 0) {
                    //const match = await bcrypt.compare(pw, rows[0].pw);
                    if (rows[0].pw == pw) {
                        return resolve(rows);
                    }
                }
                return resolve([]);
            });
        });
    }

    static async set_user_info(body) { //회원가입은 id / pw / name / gender
        return new Promise(async (resolve, reject) => {
            const { id, pw, name, gender } = body;
            //const hashedPassword = await bcrypt.hash(pw, 10);
            connect.query(`INSERT INTO user_info (id, pw, name, gender) VALUES (?, ?, ?, ?)`,
                [id, pw, name, gender], (error, result) => {
                    if (error) {return reject(error);}
                    return resolve({ result: true, message: '회원가입 되셨습니다.' });
                });
        });
    }
}

class friend_info {
    // 친구 정보 관련 메서드 추가
}

module.exports = { user_info, friend_info };
