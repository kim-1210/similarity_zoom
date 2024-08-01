"use strict";

const url = window.location.pathname;
const pathSegments = url.split('/').filter(segment => segment !== '');
const [_, room_id, id] = pathSegments;
const { nickname, pw, title, max_per, gender } = JSON.parse(localStorage.getItem(`room_info_${id}`));
const socket_room = io.connect(`http://localhost:8080?room_id=${room_id}_room`);
const chat_write = document.querySelector('.right'),
    sub_div = document.querySelector('.up');

const my_video = document.querySelector('#main');
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
        my_video.srcObject = stream;
        my_video.onloadedmetadata = () => {
            my_video.play();
        };

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = my_video.videoWidth || 640;
        canvas.height = my_video.videoHeight || 480;

        function captureAndSend() {
            ctx.drawImage(my_video, 0, 0, canvas.width, canvas.height);

            // Generate a data URL of the image
            const dataURL = canvas.toDataURL('image/jpeg'); // Or 'image/png'

            // Send the data URL to other users
            for (let i = 0; i < in_room_userID.length; i++) {
                socket_room.emit('set_video', { videoUrl: dataURL, send_userID: in_room_userID[i] });
            }
        }

        setInterval(captureAndSend, 1000);
    })
    .catch((error) => {
        console.error('Error accessing webcam: ', error);
    });



socket_room.on('get_video', (data) => {
    try {
        var remoteVideo = document.querySelector(`#${data.fromID}`);
        remoteVideo.src = data.video;
        // remoteVideo.load(); // Ensure the video element updates its source
        // remoteVideo.play(); // Play the video
    }
    catch (error) {
        console.log("error");
    }
});

const in_room_userID = [];
// const peerConnections = {};

// async function startVideo() {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//         my_video.srcObject = stream;
//         my_video.onloadedmetadata = () => my_video.play();
//     } catch (error) {
//         console.error('Error accessing webcam: ', error);
//     }
// }

// startVideo();

const send_data = {
    send_check: true,
    id: id,
    room_id: room_id + "_room",
    max: max_per,
    title: title,
    pw: pw
}
socket_room.emit("join", send_data); // 접속 시도

socket_room.on('pre_user_info', (users) => {
    console.log(users);
    if (users.length >= 1 && users[0] != id) {
        for (let i = 0; i < users.length; i++) {
            const mv_video = document.createElement('img');
            mv_video.title = "user : " + users[i];
            mv_video.autoplay = true;
            mv_video.classList.add('sub');
            mv_video.id = users[i];
            sub_div.appendChild(mv_video);

            in_room_userID.push(users[i]);
        }
    }
});

socket_room.on('kickedFromRoom', () => {
    alert('방장이 서버를 닫았습니다.');
    go_main();
});

function go_main() {
    location.href = `/main/${id}/${nickname}/${gender}`;
}

socket_room.on('getout_user', (data) => {
    const out_chat = document.createElement('p');
    out_chat.textContent = data['getout_user'] + " 님이 나갔습니다.";
    chat_write.appendChild(out_chat);

    const rm_video = document.getElementById(data['getout_user']);
    if (rm_video) {
        sub_div.removeChild(rm_video);
    }

    const index = in_room_userID.indexOf(data['getout_user']);
    if (index !== -1) {
        in_room_userID.splice(index, 1);
    }

    const peerConnection = peerConnections[data['getout_user']];
    if (peerConnection) {
        peerConnection.close();
        delete peerConnections[data['getout_user']];
    }
});

socket_room.on('enter_user', async (data) => {
    const enter_chat = document.createElement('p');
    enter_chat.textContent = data['enter_user'] + " 님이 들어왔습니다.";
    chat_write.appendChild(enter_chat);

    in_room_userID.push(data['enter_user']);

    const mv_video = document.createElement('img');
    mv_video.title = "user : " + data['enter_user'];
    mv_video.autoplay = true;
    mv_video.classList.add('sub');
    mv_video.id = data['enter_user'];
    sub_div.appendChild(mv_video);

    // const peerConnection = await createPeerConnection(data['enter_user']);
    // peerConnections[data['enter_user']] = peerConnection;

    // const offer = await peerConnection.createOffer();
    // await peerConnection.setLocalDescription(offer);
    // socket_room.emit('offer', { roomId: room_id + '_room', offer, targetId: data['enter_user'] });
});

// socket_room.on('offer', async (data) => {
//     const peerConnection = await createPeerConnection(data.socketId);
//     peerConnections[data.socketId] = peerConnection;

//     await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     socket_room.emit('answer', { roomId: room_id + '_room', answer, targetId: data.socketId });
// });

// socket_room.on('answer', async (data) => {
//     const peerConnection = peerConnections[data.socketId];
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
// });

// socket_room.on('ice_candidate', async (data) => {
//     const peerConnection = peerConnections[data.socketId];
//     try {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
//     } catch (error) {
//         console.error('Error adding received ICE candidate', error);
//     }
// });

// async function createPeerConnection(targetId) {
//     const peerConnection = new RTCPeerConnection({
//         iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//     });

//     peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//             socket_room.emit('ice_candidate', { roomId: room_id + '_room', candidate: event.candidate, targetId });
//         }
//     };

//     peerConnection.ontrack = event => {
//         console.log('Track event received:', event); // 이 로그가 출력되는지 확인하세요.
//         const mv_video = document.createElement('video');
//         mv_video.title = "user : " + targetId;
//         mv_video.autoplay = true;
//         mv_video.srcObject = event.streams[0];
//         mv_video.classList.add('sub');
//         mv_video.id = targetId;
//         sub_div.appendChild(mv_video);
//     };

//     const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//     localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//     return peerConnection;
// }
