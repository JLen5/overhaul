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
        document.querySelectorAll('.invalid').forEach((element) => {
            element.innerHTML = ''
            element.style.marginTop = 0
            element.style.marginBottom = 0 
        })

        if (password.value !== confirmPassword.value) {
            // alert('Passwords do not match');
            document.querySelector('.invalid-confirm-password').innerHTML = 'Passwords do not match!'
            return;
            
        }
        system.register(email.value, password.value, username.value);
    }catch(error){
        console.log(error);
    }
});

system.appendLogoutButton(document.querySelector('.test'))