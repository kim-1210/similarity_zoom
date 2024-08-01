const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('new_user', socket.id);
    });

    socket.on('offer', (data) => {
        const { roomId, offer, targetId } = data;
        socket.to(targetId).emit('offer', { offer, socketId: socket.id });
    });

    socket.on('answer', (data) => {
        const { roomId, answer, targetId } = data;
        socket.to(targetId).emit('answer', { answer, socketId: socket.id });
    });

    socket.on('ice_candidate', (data) => {
        const { roomId, candidate, targetId } = data;
        socket.to(targetId).emit('ice_candidate', { candidate, socketId: socket.id });
    });

    socket.on('disconnect', () => {
        io.to(roomId).emit('user_disconnected', socket.id);
    });
});

//---------------------------------------------------------------------------------------------------------

const socket_room = io.connect('http://localhost:8080');
const roomId = 'your_room_id'; // 원하는 방 ID로 변경하세요
const peerConnections = {}; // 각 클라이언트와의 peer connection을 저장할 객체

// 특정 방에 참가
socket_room.emit('join_room', roomId);

// 새로운 사용자가 방에 참가할 때
socket_room.on('new_user', async (newUserId) => {
    const peerConnection = createPeerConnection(newUserId);
    peerConnections[newUserId] = peerConnection;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket_room.emit('offer', { roomId, offer, targetId: newUserId });
});

// offer 수신 및 처리
socket_room.on('offer', async (data) => {
    const peerConnection = createPeerConnection(data.socketId);
    peerConnections[data.socketId] = peerConnection;

    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket_room.emit('answer', { roomId, answer, targetId: data.socketId });
});

// answer 수신 및 처리
socket_room.on('answer', async (data) => {
    const peerConnection = peerConnections[data.socketId];
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
});

// ICE candidate 수신 및 처리
socket_room.on('ice_candidate', async (data) => {
    const peerConnection = peerConnections[data.socketId];
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
        console.error('Error adding received ICE candidate', error);
    }
});

// 사용자가 방을 떠날 때
socket_room.on('user_disconnected', (socketId) => {
    const peerConnection = peerConnections[socketId];
    if (peerConnection) {
        peerConnection.close();
        delete peerConnections[socketId];
    }
});

async function createPeerConnection(targetId) {
    const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket_room.emit('ice_candidate', { roomId, candidate: event.candidate, targetId });
        }
    };

    peerConnection.ontrack = event => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        document.body.appendChild(remoteVideo);
    };

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    return peerConnection;
}

const myVideo = document.getElementById('main');
myVideo.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
myVideo.onloadedmetadata = () => myVideo.play();
