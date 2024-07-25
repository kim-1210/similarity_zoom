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
            location.href = "/main";
        }
        else{
            fail_content.innerHTML = data.message;
        }
    })
    .catch((error) => console.log('error : ', error));
}
