import System from "../firebase/system.js";
import {nanoid} from 'https://cdnjs.cloudflare.com/ajax/libs/nanoid/3.3.4/nanoid.min.js'

document.addEventListener("DOMContentLoaded", attachListeners);
// document.addEventListener("DOMContentLoaded", checkPage);
// test

import {onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const system = new System();

function attachListeners() {
    // document.querySelector('.login_form')?.addEventListener('submit', login);
    // let logoutButton = document.querySelector('.logout');
    // if (logoutButton) {
    //     logoutButton.addEventListener('click', logout);
    // }
    system.auth.onAuthStateChanged((user) => {
        // add files
        if (user) {
            // console.log(user)
            system.getData(system.userRef).then((snapshot) => {
                snapshot = snapshot.val();
                snapshot.notes.forEach(note => {
                    addFile(note.title, note.id);
                });
            });
        }
    })
    system.auth.onAuthStateChanged((user) => {
        system.onAuthStateChanged(user);
    })

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', () => {
            const fileName = 'My New File'
            const content = '' 
            const id = nanoid(8)
            createNote(fileName, content, id);
            addFile(fileName, id);
        });
    }
}

const createNote = async (title, content, id) => {
    console.log('creating note');
    let userData = await system.getData(system.userRef)
    userData = userData.val();
    // console.log(userData);
    userData.notes.push({
        id: id,
        title: title,
        content: content
    });
    // console.log(userData);
    system.setData(system.userRef, userData);
}

const openFile = (content) => {
    let note = document.querySelector('.notes textarea');
    note.value = content;
}

function addFile(title, id) {

    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');

    newFileButton.textContent = title;
    
    newFileButton.addEventListener('click', () => {
        system.getData(system.userRef).then((snapshot) => {
            snapshot = snapshot.val();
            snapshot.notes.forEach(note => {
                if (note.id === id) {
                    openFile(note.content);
                }
            });
        });
    });

    filebar.appendChild(newFileButton);
}


window.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const note = document.querySelector('.notes textarea');
        console.log(note.value);
    }
})

