"use strict";
const url = window.location.pathname;
const pathSegments = url.split('/').filter(segment => segment !== '');
const [_, id, nickname, gender] = pathSegments;

document.querySelector('#create_btn').addEventListener('click', function(){
    const label_btn = document.querySelector('#label_btn'),
    modal = document.querySelector('.modal');
    if(label_btn.textContent == '+'){label_btn.textContent = '-';
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        }, 10); 
    }
    else{
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
        if(Number(value) > 10 || Number(value) < 2){
            person_number.value = 2;
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('n_pw');
    const button = document.getElementById('check_pw');

    button.addEventListener('click', () => {
        input.disabled = !input.disabled;
    });
});