"use strict";

var id = document.querySelector('#id'),
    pw = document.querySelector('#pw'),
    register_btn = document.querySelector('#register_btn'),
    fail_content = document.querySelector('#fail_content'),
    nickname = document.querySelector('#name'),
    gender = document.querySelector('#genderToggle');

var gender_value = 1;
document.getElementById('genderToggle').addEventListener('click', function () {
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
        gender_value = 0;
    } else {
        gender_value = 1;
    }
});

register_btn.addEventListener('click', register_fuc);

function register_fuc() {
    id = document.querySelector('#id'),
        pw = document.querySelector('#pw'),
        nickname = document.querySelector('#name'),
        gender = document.querySelector('#genderToggle');
    if (id.value.length > 2 && pw.value.length > 4 && nickname.value.length > 1) {
        const req = {
            id: id.value, 
            pw: pw.value, 
            name: nickname.value, 
            gender: gender_value
        };
        fetch('http://localhost:8080/get_register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        })
            .then((res) => { return res.json() })
            .then((data) => {
                if(data.result){
                    fail_content.textContent = "회원가입되었습니다.";
                    id.value = '', pw.value = '', nickname.value = '';
                    setTimeout(()=>{
                        location.href = '/';
                    }, 1000);
                }
            })
            .catch((error) => { console.log('error : ', error) })
    }
    else {
        fail_content.textContent = "ID와 패스워드, 이름을 입력하세요.";
    }
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