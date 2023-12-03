// test
import System from '../firebase/system.js';

import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const system = new System();

document.querySelector('#no-account').addEventListener('click', (event) => {
    window.location = 'register.html'
})

function login(event) {
    event.preventDefault();

    let username = document.querySelector('.login_form input[type="username"]').value;
    let password = document.querySelector('.login_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    system.signIn(username, password);

    
}

document.querySelector('.login_form').addEventListener('submit', login);

