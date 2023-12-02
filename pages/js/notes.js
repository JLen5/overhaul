import System from "../firebase/system";
document.addEventListener("DOMContentLoaded", attachListeners);
// document.addEventListener("DOMContentLoaded", checkPage);
// test

const system = new System();

function attachListeners() {
    document.querySelector('.login_form')?.addEventListener('submit', login);
    // let logoutButton = document.querySelector('.logout');
    // if (logoutButton) {
    //     logoutButton.addEventListener('click', logout);
    // }

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', addFile);
    }
}

const createNote = (title, content) => {
    system.g(system.userRef, {
        title: title,
        content: content
    })
}

function addFile() {
    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');
    newFileButton.textContent = 'My New File';
    
    newFileButton.addEventListener('click', () => {

    });

    filebar.appendChild(newFileButton);
}


window.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const note = document.querySelector('.notes textarea');
        console.log(note.value);
    }
})

