import System from "../firebase/system.js";
import {nanoid} from 'https://cdnjs.cloudflare.com/ajax/libs/nanoid/3.3.4/nanoid.min.js'

document.addEventListener("DOMContentLoaded", attachListeners);
// document.addEventListener("DOMContentLoaded", checkPage);
// test

const system = new System();

function attachListeners() {
    // document.querySelector('.login_form')?.addEventListener('submit', login);
    // let logoutButton = document.querySelector('.logout');
    // if (logoutButton) {
    //     logoutButton.addEventListener('click', logout);
    // }
    const note = document.querySelector('.notes textarea');
    note.addEventListener('keydown', (event) => {
        saveFile();
    })
    

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
        content: content,
        timestamp: Date.now()
    });
    // console.log(userData);
    system.setData(system.userRef, userData);
}

let currentNoteId = null;
const saveFile = () => {
    if (currentNoteId === null) {return}
    const localNote = document.querySelector('.notes textarea');
    // console.log(localNote.value);
    system.getData(system.userRef).then((snapshot) => {
        snapshot = snapshot.val();
        snapshot.notes.forEach(note => {
            if (note.id === currentNoteId) {
                note.content = localNote.value;
                note.timestamp = Date.now();
                // console.log(note.content, localNote.value)
            }
        });
        system.setData(system.userRef, snapshot);
    });
}

const openFile = (content) => {
    let note = document.querySelector('.notes textarea');
    note.value = content;
}
// 1701546933730
function addFile(title, id) {

    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');

    newFileButton.textContent = title;
    
    newFileButton.addEventListener('click', () => {
        currentNoteId = id;
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

