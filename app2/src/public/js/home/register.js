"use strict";

const id = document.querySelector('#id'),
pw = document.querySelector('#pw'),
login_btn = document.querySelector('#register_btn'),
fail_content = document.querySelector('#fail_content'),
name = document.querySelector('#name'),
gender = document.querySelector('#genderToggle');

document.getElementById('genderToggle').addEventListener('click', function() {
    this.classList.toggle('active');
});

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