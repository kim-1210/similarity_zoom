"use strict";

const id = document.querySelector('#id'),
pw = document.querySelector('#pw'),
login_btn = document.querySelector('#login_btn'),
fail_content = document.querySelector('#fail_content');

login_btn.addEventListener('click', login_check);

function login_check(){
    const req = {
        id : id.value,
        pw : pw.value,
    };
    fetch('http://localhost:8080/login_check',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(req),
    })
    .then((response) =>{ return response.json()})
    .then((data) =>{
        if(data.result){
            setTimeout(()=>{
                location.href = `/main/${id.value}/${data.nickname}/${data.gender}`;
            }, 500);
        }
        else{
            fail_content.innerHTML = data.message;
        }
    })
    .catch((error) => console.log('error : ', error));
}


function togglePassword() {
    const visibilityIcon = document.querySelector('#visibility');
    if (pw.type === 'password') {
        pw.type = 'text';
        visibilityIcon.textContent = '□'; // 눈 감는 아이콘
    } else {
        pw.type = 'password';
        visibilityIcon.textContent = '■'; // 눈 뜨는 아이콘
    }
}