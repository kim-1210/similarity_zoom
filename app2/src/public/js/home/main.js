"use strict";
const url = window.location.pathname;
const pathSegments = url.split('/').filter(segment => segment !== '');
const [_, id, nickname, gender] = pathSegments;
const chat_room_list = document.querySelector('#chat_room_list');
var socket_list = io();

socket_list.emit('get_chat_list');
socket_list.on('chat_list', (data) => {
    chat_room_list.innerHTML = "";
    const { id_list, title_list, pw_list, in_per, max_per } = data;
    console.log('값을 받음 : ' + id_list.length);
    for (let i = 0; i < id_list.length; i++) {
        chat_room_list.appendChild(createChannelElement(title_list[i], id_list[i], pw_list[i], in_per[i], max_per[i]));
    }
})

setInterval(() => {
    socket_list.emit('get_chat_list');
    socket_list.on('chat_list', (data) => {
        chat_room_list.innerHTML = "";
        const { id_list, title_list, pw_list, in_per, max_per } = data;
        console.log('값을 받음 : ' + id_list.length);
        for (let i = 0; i < id_list.length; i++) {
            chat_room_list.appendChild(createChannelElement(title_list[i], id_list[i], pw_list[i], in_per[i], max_per[i]));
        }
    })
}, 5000);

if (gender == 0) {
    document.querySelector('#gender_span').textContent = 'GD : (WOMEN)';
    document.querySelector('#gender_img').src = "data:image/png;base64,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";
}
else {
    document.querySelector('#gender_span').textContent = 'GD : (MAN)';
    document.querySelector('#gender_img').src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK3ElEQVR4nO1ceWwU1xl/qpqqjapU6qW0SXpJbf6qlHbGjjmCgV2wwbsz6/gAmxAHAy6Xr4CN543NgrETzOIrZsfYmNM2hhCIEnZsMA2gcp+hjUUOgiFpgLYRN7Q5UL7qezOz+CL42GPW5if9xHo9x/f95r3vGgtCHuIhhjScNu6nkiMskYpcBRX5Vipw56jIX6UCd5eK/G32s8AdkkS+Kk/kJmYnRPyADHU4neQ7VAiLlQR+pyRyX1ORh15T4P9DBT7HaeMeJUMRVOBiJJH7wBBEFnl4JWkEVE4bAzWzomDd3IlQn2GDxmwBGrLssD49BupmR0PFS2NgaeJwr5CSwJ/JF7k/kqGChQncj6jINRkCLI6PgKrUsVCfaYNN2UKvuXpWFBTGR+hCcjep/c8RZLBDtof/lgrch+h0fmwYE64x294n4TqyMVOAkinP6SuRuyI//6dfk8GKvOf531GRv4jOLk0cxrZkf4XrTDssSxpprMQWMhjhTIj4sSRyH6GTxZNHQENm/1ddT8RYWRAbrq1Ekb9DRf4sFfn11M6JmKhIqIOK3DZj5TVk9S3W9ZZlKaN7zNaSyLXJDm4kCVVIAhePjhTEhvlw296fuLoxg7+WOpYlKL3k+UpycLNJqCEtjXtEErl2dMI9w+p38bolmWw7lKeMYSUSFflv8GGSUIIshE1B8QoThrFgH2gBDVZNt3jjY25s+JMkVEBF/gAargRh9XVlSbKWqSWBqyGhAFnkn8Jtk+8IZ52EX+NeL66/fl6MtpUxHiY88zNiduQJ/DR84suSR/pdvCUJEeB6YRQrZ77t2Ff1elF2cEnE7KAiV4vGVqVa/CogCudtC+Oehbo50fePhal6LBS4dcTskAR+Pxq7evb9HRoIcchQqtd+zoQIWDlnHBgtYs1fxvd4zpo50cYA4igxOySR+wyN3eCH2q8h0+Zt3xY9/yyc3jIPbp0ogjcKE7QtGhvGJjfd4mB6jFFctxOzQxL4W2isLzsPXHWY0Z1xWttWOGkYtG3NhDunir3cXpSoCxve7eFhvNS3+21idlBtksycHqhwmBwwfmGyMOJddXoUXNwjdxIPeftkEayZr600nC/2JKAkcv8jZockcjfQ2N7M+TZm2lh8Wj07ClaljWddS2XqWFgxNZKJpncSjCUvjoKj62cxobqKZ/Dz/YugKGkEO75jPNyQoW9hgb9EzA5J4C+gsT33v3bmGM7yMIY9aHy/OCEC1ubY4N2meXDrW4TryL1KKhgDjHtJZIIh4D+I2UFF7hgaWzdnQifx1s2bAEWJwzoJtHTycFgxfTQo88bDuhwbbHHGwY6SZNhbnQofvjUfbp5Y2ivROvLGsUIoTtZW4dq5mg3KDC1TU5HfSswOivM4kYeV0++1ceiIMbdbnjIK9q1Khcv78vssTm+5dUk8uxe+Z+k08hJ4JzE7qMDnoLGlUyO1DJoleJPA+lw7XDu8xG/CGTy9OZ3dr3jScGYD/quvQDsxO2SRG63FIM14LD/w5xWpkXDtiP/FQ37amuetFbGckh1hmIG/dkaHP0bMDmdk5PexXMAMimUI9sToDG7bQIiHxFXOuhOH1p3obdxBEiqQHWEskWBp4ozTsu0/W6WACYg0ElXpi5GamPHh1SQUoMgWa0naCPbXBsunPMdWAX4O1PbtKqARf8syR3+lyOPGErNDoZYjry0Yozf4WuZFBlK8jgKy9zJx4eCWLOCm1kPE7FCo9b8KtULZjM5vy4Ip4NrcGECb3JLlDjE7FMl6DY192zXZNALuWZXCBFSo5SoxO9zUcgCNPbAhlU1Ggi3gksnD4HD9TG0FUuvfiNnhphYJjd3iioW6BRODLmC9LMAWl0NfgdaFxOxYuSDycSMOtrqnBl3A3cpUb/yrlKLN/1IJoVCrE41evSjKePIBF9C47z0bLAUkVOB0Rn7XLVneQcOrdUduHO/7ZKW/vH6s0Csgo2TdjTaRUEKN0/aoW7I2GE78e39BwAT81/78DgJa6kuzQ/jvqhXZ8nd05FxrbsAEbN+Vo2ddy2kS6lCo9TV05nDjzIAJeLBhhpE4ykmoYyW1iOjMtrL4gAn4RlmcvgLHmX/+9yBUOqMfc1PrTUW2wsW91O/ifbZH0hOH5cZKZ+QPyWCAW7KUs7qw9gW/C7hz1RQj85aSwYLqhVG/cUuWL7GkaW/N8Zt45zB5yCzzflGz0PorMpjglqyLcGU0virA9aO+nw3iNRtesRs9r0wGG2rSuEfc1HoKHdxeHt+vV5b3443jhSxJ6Vv3ZMgVzb2FWx7/lCJZPkVH36xM9MmU+uqRxfBmRYIh3gW8BxnMUPLHPK1Q62V0eGOxDc7v7n+Bfb41FzYW2Yya71J1vvX3ZCigmo59wttqyeOgWUmCi/t6X+JgOaS6k9i5xnWqcqy/JEMJiu54bcF4rwhNyx1wZFNaj1sbv8Pf4THG8TUdziVDDYru+Ps7MtlqqnNGe8XYUGSDtrcz2VQFs2vbWxnsO+P3eGyzMhk+2JH1UMD2XQsYz7XMh6NNaazM6TSK6kD8HR6DxxrnDfkV2K4L4RVy53zYt34abFomsu2NxM/4XUfhhpSAExd4HhclNdkuqZUC9ewSqOes4XhXQfpK4zp4Tbw23sMue5LwniSU4cjb/hOBejLskue4QFXoSsPxj3tYVb0lnntPwO73EKjnmF3ypKMtJFQQm9v8pJ16KgRJvWM44ihogZQVhyCjtg2khnYo3H4ZqoqnM8d31bzQbwHxXFbCFM9g18Rrp9e0wUuuQxBb0NJRyNuC5CmPoTueIGZFWtqJRwTJk8eMRaNlFVJch2Bh/TkoUa+Cq+V6J5ZtPgQKHcfemRysn95n8fAc7X3LOCjbfLjb9fGeuRs/hhTXQWaLIaRdUnPRVmImCPktTwtUPW088WmlR2DxG5e6OdWVFas36sW0lRXTHzW//EDh8JgWJdlbRFfU1T/wPou3XYJppYe9K9Iuqe868tQ/EDPARtU4u+S5hYYlFr4D+U2fPNChTiKuaQRFjvK+gmx2J7FS5cxbGXC25WVG/Hx000xW+3lfU8pRULGmqU/3ok2fQELhX3UR0eYdsUEVT6DqLDtV76JBM8qPwTLPlT45ZLD09RNQVZJ53/qvK6uWZ0HZ1pP9uterniswvfyYJiJV79qpJy1o4gl6rMuofQ+WN/fdmW5Cbj0FFatqoaokA1YunQpKQQwjfsbvKmtq2TEDvQ/aml7znjc2BlxEtm1x5ckqZK85M2CHgsWsuveZiOiLTVIdAUsYRsxLr2kLuggDJVuJ2na+GZO/w7/jsATn698zsi3GvOU+2LbBJvqQWnbU2Mqn/FriaHWelm0xGLtMIIAviL4kLtGysy3Ps8Av4mEVbxTJ8ua+lSquEKDcdMFb3sTSll/4XEDWnlEVUku7V/2uQUKj2LZLnlLfDwawt5XVXnUYrhAldixaaeO57dMBBE5V8Mlgkx5sJ11+Juudsb6V1Lk+E9AYSeFgINgOuvxMHEDo/bJv/oMKDKgC9XzjyG/pcariGmREH7VRmOebWOeunw9YQJwk4xPBeV6wnXMFiDiGQ59FWZ00YAG1MbwKmbWh33W4ekns7bU46Bn4H2hq7zBUoI3ng+6YK0DMa2g3BGz2gYDqObzYkm2Dt3xxdWHh9kvGBPvsgAW0S54rPb+wGQKU1M99IKD6ZdAdocGi54sBC/gQD0H8if8DXD0w4SFfKrwAAAAASUVORK5CYII=";
}
document.querySelector('#id_span').textContent = '( ' + id + ' )';
document.querySelector('#nickname_span').textContent = '( ' + nickname + ' )';

document.querySelector('#create_btn').addEventListener('click', function () {
    const label_btn = document.querySelector('#label_btn'),
        modal = document.querySelector('.modal');
    if (label_btn.textContent == '+') {
        label_btn.textContent = '-';
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        }, 10);
    }
    else {
        modal.style.opacity = '0';
        label_btn.textContent = '+';
        modal.style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const numberPassword = document.getElementById('n_pw');
    numberPassword.addEventListener('input', () => {
        const value = numberPassword.value.replace(/[^0-9]/g, '');
        numberPassword.value = value;
    });

    const person_number = document.getElementById('person_number');
    person_number.addEventListener('input', () => {
        const value = person_number.value.replace(/[^0-9]/g, '');
        person_number.value = value;
        if (Number(value) > 10 || Number(value) < 2) {
            person_number.value = 2;
        }
    });

    const input = document.getElementById('n_pw');
    const button = document.getElementById('check_pw');
    button.addEventListener('click', () => {
        input.disabled = !input.disabled;
    });
});

const create_room_btn = document.querySelector('#create_room_btn');
create_room_btn.addEventListener('click', create_room_func);

function create_room_func() {
    var pw = document.querySelector('#n_pw').value;
    if (pw.length <= 0) {
        pw = '';
    }
    const send_data = {
        id: id,
        max: document.querySelector('#person_number').value,
        title: document.querySelector('#room_title').value,
        pw: pw
    }
    const socket_room = io.connect(`http://localhost:8080?room_id=${id}`);
    socket_room.emit("join", send_data); //접속 시도
    var room_title = document.querySelector('#room_title').value;
    //id pw title 
    localStorage.setItem(`room_info_${id}`, JSON.stringify({id : id, nickname: nickname, pw: pw, title: room_title, max_per: document.querySelector('#person_number').value, gender : gender }))
    location.href = `/chat_room/${id}`;
}

function createChannelElement(title, id, password, in_count, max_count) { //채널방 목록 객체화
    // Create main container div
    const channelContainer = document.createElement('div');
    channelContainer.className = 'contain';

    // Create and append the title section
    const titleSection = document.createElement('div');
    titleSection.className = 'title';
    titleSection.innerHTML = `<span class="channel_category">${title}</span>`;
    channelContainer.appendChild(titleSection);

    // Create and append the ID section
    const idSection = document.createElement('div');
    idSection.className = 'id';
    idSection.innerHTML = `<span class="channel_category">${id}</span>`;
    channelContainer.appendChild(idSection);

    // Create and append the password section
    const passwordSection = document.createElement('div');
    passwordSection.className = 'pw';
    passwordSection.innerHTML = `<span class="channel_category">${password}</span>`;
    channelContainer.appendChild(passwordSection);

    // Create and append the count section
    const countSection = document.createElement('div');
    countSection.className = 'num_per';
    countSection.innerHTML = `<span class="channel_category">${in_count}/${max_count}</span>`;
    channelContainer.appendChild(countSection);

    return channelContainer;
}


function login_go() { location.href = '/'; }

document.getElementById('chat_room_list').addEventListener('click', function (event) { //리스트 클릭시 반응
    // 클릭된 요소를 가져옵니다.
    const clickedElement = event.target;
    if (clickedElement && clickedElement.closest('.contain')) {
        const parentElement = clickedElement.closest('.contain');
        in_room_cli(parentElement);
    }
});

function in_room_cli(parentEle) {
    const room_title = parentEle.querySelector('.title').querySelector('.channel_category').textContent;
    const room_id = parentEle.querySelector('.id').querySelector('.channel_category').textContent;
    const room_pw = parentEle.querySelector('.pw').querySelector('.channel_category').textContent;
    const parts = parentEle.querySelector('.num_per').querySelector('.channel_category').textContent.split('/');
    const max_per = parts[1].Number;

    const send_data = {
        id: room_id,
        max: max_per,
        title: room_title,
        pw: room_pw
    }
    const socket_room = io.connect(`http://localhost:8080?room_id=${room_id}`);
    socket_room.emit("join", send_data); //접속 시도
    //id pw title 
    socket_room.on('room-full', (data) =>{
        const answer = data;
        if (answer == room_id) {
            localStorage.setItem(`room_info_${room_id}`, JSON.stringify({id : id, nickname: nickname, pw: room_pw, title: room_title, max_per: max_per, gender: gender }))
            location.href = `/chat_room/${room_id}`;
        }
    })
}