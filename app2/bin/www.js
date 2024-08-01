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
        if (roomCounts[room['room_id']] === undefined) {
            roomCounts[room['room_id']] = 1;
            room_max[room['room_id']] = room['max'];
            titles[room['room_id']] = room['title'];
            pws[room['room_id']] = room['pw'];
        }
        else if (roomCounts[room['room_id']] < room_max[room['room_id']]) {
            roomCounts[room['room_id']]++;
            socket.emit('room-full', room['room_id']);
            if(room['send_check']){
                io.to(room['room_id']).emit('enter_user', {enter_user : room['id']}) //안에 있는 모든 사람들에게 알림
            }
        }
        else {
            socket.emit('room-full', '');
            return;
        }
        socket.join(room['room_id']);

        socket.on('disconnect', () => {
            roomCounts[room['room_id']]--;
            if (roomCounts[room['room_id']] == 0) {
                delete roomCounts[room['room_id']];
                delete room_max[room['room_id']];
                delete titles[room['room_id']];
                delete pws[room['room_id']];
            }
        });

        socket.on('leaving', (data) => {
            const id = data['id'];
            if (roomCounts[id] !== undefined) {
                kicked(id);
            }
            else{
                io.to(room['room_id']).emit('getout_user', {getout_user : id})
            }
        })

        socket.on('voice_on', (data)=>{ //마이크
            io.to(room['room_id']).emit('get_voice', {voice : data.voice, id : data.id})
        })

        socket.on('video_on', (data) =>{ //화상
            io.to(room['room_id']).emit('get_video', {video_on : data.video, id : data.id})
        })
    });

    function kicked(id){
        io.to(id).emit('kickedFromRoom');
    }
});