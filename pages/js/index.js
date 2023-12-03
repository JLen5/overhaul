import System from '../firebase/system.js';
const system = new System();

document.querySelector('.signin').addEventListener('click', (event) => {
    console.log(system.uid)
    if (system.uid) {
        window.location = 'notes.html'
    } else {
        window.location = 'login.html'
    }
})

document.querySelector('.signup').addEventListener('click', (event) => {
    console.log(system.uid)
    if (system.uid) {
        window.location = 'notes.html'
    } else {
        window.location = 'register.html'
    }
})
