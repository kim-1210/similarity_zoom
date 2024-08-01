"use strict";

const url = window.location.pathname;
const pathSegments = url.split('/').filter(segment => segment !== '');
const [_, room_id] = pathSegments;
const { id, nickname, pw, title, max_per, gender } = JSON.parse(localStorage.getItem(`room_info_${room_id}`));
const socket_room = io.connect(`http://localhost:8080?room_id=${room_id}`);
console.log('id : ', id);
console.log(nickname, ', ', pw, ', ',title, ', ', max_per, ', ',gender);

const send_data = {
    id: room_id,
    max: max_per,
    title: title,
    pw: pw
}
socket_room.emit("join", send_data); //접속 시도
window.onbeforeunload = function(){
    leaveRoom();
}

socket_room.on('kickedFromRoom', () => {
    go_main();
});

function leaveRoom() {
    socket_room.emit('leaving', { id: id });
}

function go_main(){
    location.href = `/main/${id}/${nickname}/${gender}`;
}