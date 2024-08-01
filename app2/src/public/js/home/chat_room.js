"use strict";

const url = window.location.pathname;
const pathSegments = url.split('/').filter(segment => segment !== '');
const [_, room_id] = pathSegments;
const { id, nickname, pw, title, max_per, gender } = JSON.parse(localStorage.getItem(`room_info_${room_id}`));
const socket_room = io.connect(`http://localhost:8080?room_id=${room_id}`);
const chat_write = document.querySelector('.right'),
    sub_div = document.querySelector('.up');

const my_video = document.querySelector('#main');
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
        my_video.srcObject = stream;
        my_video.onloadedmetadata = () => {
            my_video.play();
        };
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                const reader = new FileReader();
                reader.onload = function () {
                    socket_room.emit('video_on', { video: reader.result, id: id });
                };
                reader.readAsArrayBuffer(event.data);
            }
        };
        mediaRecorder.start(100);
    })
    .catch((error) => {
        console.error('Error accessing webcam: ', error);
    });


const send_data = {
    send_check: true,
    id: id,
    room_id: room_id,
    max: max_per,
    title: title,
    pw: pw
}
socket_room.emit("join", send_data); //접속 시도
window.onbeforeunload = function () {
    leaveRoom();
}

socket_room.on('kickedFromRoom', () => {
    go_main();
});

function leaveRoom() {
    socket_room.emit('leaving', { id: id });
}

function go_main() {
    location.href = `/main/${id}/${nickname}/${gender}`;
}

socket_room.on('getout_user', (data) => {
    const out_chat = document.createElement('p');
    out_chat.textContent = data['getout_user'] + " 님이 나갔습니다.";
    chat_write.appendChild(out_chat);
    const rm_video = document.getElementById(data['getout_user']);
    sub_div.removeChild(rm_video);
})

socket_room.on('enter_user', (data) => {
    const enter_chat = document.createElement('p');
    enter_chat.textContent = data['enter_user'] + " 님이 들어왔습니다.";
    chat_write.appendChild(enter_chat);
    var mv_video = document.createElement('video');
    mv_video.title = "user : " + data['enter_user'];
    mv_video.autoplay = true;
    mv_video.classList.add('sub');
    mv_video.id = data['enter_user'];
    sub_div.appendChild(mv_video);
})

socket_room.on('get_video', (data) => {
    try {
        var remoteVideo = document.querySelector(`#${data.id}`);
        const blob = new Blob([data.video], { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        console.log(videoUrl)
        remoteVideo.src = videoUrl;
        remoteVideo.load(); // Ensure the video element updates its source
        remoteVideo.play(); // Play the video
    }
    catch (error) {
        console.log("error");
    }
});