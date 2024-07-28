"use strict";

const url = window.location.pathname;
const pathSegments = url.split('/').filter(segment => segment !== '');
console.log(pathSegments)
const [_, id] = pathSegments;
const {nickname, pw, title, max_per } = JSON.parse(localStorage.getItem(`room_info_${id}`));
const socket_room = io.connect(`http://localhost:8080?room_id=${id}`);

const send_data = {
    id: id,
    max: max_per,
    title: title,
    pw: pw
}

socket_room.emit("join", send_data); //접속 시도