"use strict";

const server = require('../app');
const socketIO = require('socket.io');
const PORT = 8080;

server.listen(PORT);
server.on('listening', onListening);

function onListening() {
    console.log(`connect!!! ${PORT}`)
}

var io = socketIO(server);

const room_max = {},
    roomCounts = {},
    titles = {},
    pws = {};

io.on('connection', (socket) => {
    socket.on('get_chat_list', () => {
        var id_list = Object.keys(roomCounts);
        var title_list = Object.values(titles);
        var pw_list = Object.values(pws);
        var in_per = Object.values(roomCounts);
        var max_per = Object.values(room_max);
        var total = { id_list, title_list, pw_list, in_per, max_per };
        socket.emit('chat_list', { id_list, title_list, pw_list, in_per, max_per })
    })

    socket.on('join', (room) => { //room 변수는 딕셔너리 처리 {id, person_max}
        if (roomCounts[room['id']] === undefined) {
            roomCounts[room['id']] = 1;
            room_max[room['id']] = room['max'];
            titles[room['id']] = room['title'];
            pws[room['id']] = room['pw'];
        }
        else if (roomCounts[room['id']] < room_max[room['id']]) {
            roomCounts[room['id']]++;
            socket.emit('room-full', room['id']);
        }
        else {
            socket.emit('room-full', '');
            return;
        }
        socket.join(room['id']);

        socket.on('disconnect', () => {
            roomCounts[room['id']]--;
            if (roomCounts[room['id']] == 0) {
                delete roomCounts[room['id']];
                delete room_max[room['id']];
                delete titles[room['id']];
                delete pws[room['id']];
                console.log('id_list2 : ' + Object.keys(roomCounts));
            }
        });

        socket.on('leaving', (data) => {
            const id = data['id'];
            if (roomCounts[id] !== undefined) {
                kicked(id);
            }
        })
    });

    function kicked(id) {
        io.to(id).emit('kickedFromRoom');
    }

    // socket.on("offer", data => { //클라가 새로운 연결 요청을 보낼때
    //     socket.to(data.offerReceiveID).emit("getOffer", {
    //         sdp: data.sdp,
    //         offerSendID: data.offerSendID,
    //         offerSendEmail: data.offerSendEmail,
    //     });
    // });

    // socket.on("answer", data => { //연결 요청에 대한 응답 보낼때
    //     socket.to(data.answerReceiveID).emit("getAnswer", {
    //         sdp: data.sdp,
    //         answerSendID: data.answerSendID,
    //     });
    // });

    // socket.on("candidate", data => { // 다른 클라이언트에게 보낼때 
    //     socket.to(data.candidateReceiveID).emit("getCandidate", {
    //         candidate: data.candidate,
    //         candidateSendID: data.candidateSendID,
    //     });
    // });

    // socket.on("disconnect", () => {
    //     console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    //     const roomID = socketToRoom[socket.id];
    //     let room = users[roomID];
    //     if (room) {
    //         room = room.filter(user => user.id !== socket.id);
    //         users[roomID] = room;
    //         if (room.length === 0) {
    //             delete users[roomID];
    //             return;
    //         }
    //     }
    //     socket.to(roomID).emit("user_exit", { id: socket.id });
    //     console.log(users);
    // });
});