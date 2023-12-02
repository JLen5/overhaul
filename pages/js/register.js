import System from '../firebase/system.js';

const email = document.querySelector('.email');
const username = document.querySelector('.username');
const password = document.querySelector('.password');
const confirmPassword = document.querySelector('.confirm-password');
const registerButton = document.querySelector('.register-btn');

const system = new System();

registerButton.addEventListener('click', () => {
    console.log(email.value, username.value, password.value);
    try{
        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match');
            return;
            
        } 
        system.register(email.value, password.value, username.value);
        // window.location.assign('login.html');
    }catch(error){
        console.log(error);
    }
});

system.appendLogoutButton(document.querySelector('.test'))