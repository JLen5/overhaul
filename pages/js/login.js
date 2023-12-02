// test
import System from '../firebase/system.js';

const system = new System();


function login(event) {
    event.preventDefault();

    let username = document.querySelector('.login_form input[type="username"]').value;
    let password = document.querySelector('.login_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    system.signIn(username, password);

    //window.location = 'notes.html';
}

document.querySelector('.login_form').addEventListener('submit', login);

