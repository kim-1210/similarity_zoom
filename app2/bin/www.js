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
    pws = {},
    room_ids = {},
    room_socket_ids = {};

io.on('connection', (socket) => {
    socket.on('get_chat_list', () => {
        var id_list = Object.keys(roomCounts);
        id_list = id_list.map(id => id.replace('_room', ''));
        var title_list = Object.values(titles);
        var pw_list = Object.values(pws);
        var in_per = Object.values(roomCounts);
        var max_per = Object.values(room_max);
        socket.emit('chat_list', { id_list, title_list, pw_list, in_per, max_per })
    })

    socket.on('join', (room) => { //room 변수는 딕셔너리 처리 {id, person_max}
        if (roomCounts[room['room_id']] === undefined) {
            room_ids[room['room_id']] = [room['id']];
            room_socket_ids[room['room_id']] = [socket.id];
            roomCounts[room['room_id']] = 1;
            room_max[room['room_id']] = room['max'];
            titles[room['room_id']] = room['title'];
            pws[room['room_id']] = room['pw'];
        }
        else if (roomCounts[room['room_id']] < room_max[room['room_id']]) {
            roomCounts[room['room_id']]++;
            socket.emit('room-full', room['room_id']);
            if (room['send_check']) {
                io.to(room['room_id']).emit('enter_user', { enter_user: room['id'] }); //안에 있는 모든 사람들에게 알림
                socket.emit('pre_user_info', room_ids[room['room_id']]);
                room_ids[room['room_id']].push(room['id']);
                room_socket_ids[room['room_id']].push(socket.id);
            }
        }
        else {
            socket.emit('room-full', '');
            return;
        }
        socket.join(room['room_id']);

        socket.on('disconnect', () => {
            if (room_ids[room['room_id']]) {
                roomCounts[room['room_id']]--;
                const index = room_ids[room['room_id']].indexOf(room['id']);
                if (index !== -1) {
                    room_ids[room['room_id']].splice(index, 1); // index에서 1개의 요소를 제거
                    room_socket_ids[room['room_id']].splice(index, 1);
                }
            }
            if (roomCounts[room['id'] + '_room'] !== undefined) {
                delete roomCounts[room['room_id']];
                delete room_max[room['room_id']];
                delete titles[room['room_id']];
                delete pws[room['room_id']];
                delete room_ids[room['room_id']];
                delete room_socket_ids[room['room_id']];
                kicked(room['id'] + '_room');
            }
            else {
                if (room['send_check']) {
                    io.to(room['room_id']).emit('getout_user', { getout_user: room['id'] })
                }
            }
        });

        socket.on('set_video', (data) => {
            const index = room_ids[room['room_id']].indexOf(data.send_userID);
            if (index !== -1) {
                socket.to(room_socket_ids[room['room_id']][index]).emit('get_video', { fromID: room['id'], video: data.videoUrl });
            }
        })

        // socket.on('offer', (data) => {
        //     const { roomId, offer, targetId } = data;
        //     socket.to(targetId).emit('offer', { offer, socketId: room.id });
        // });

        // socket.on('answer', (data) => {
        //     const { roomId, answer, targetId } = data;
        //     socket.to(targetId).emit('answer', { answer, socketId: room.id });
        // });

        // socket.on('ice_candidate', (data) => {
        //     const { roomId, candidate, targetId } = data;
        //     socket.to(targetId).emit('ice_candidate', { candidate, socketId: room.id });
        // });
    });

    function kicked(id) {
        io.to(id).emit('kickedFromRoom');
    }
});