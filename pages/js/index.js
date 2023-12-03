import System from '../firebase/system.js';
const system = new System();

document.querySelector('.signin').addEventListener('click', (event) => {
    if (system.uid) {
        window.location = 'notes.html'
    } else {
        window.location = 'login.html'
    }
})
