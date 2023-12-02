import System from "../firebase/system.js";
import {nanoid} from 'https://cdnjs.cloudflare.com/ajax/libs/nanoid/3.3.4/nanoid.min.js'

document.addEventListener("DOMContentLoaded", attachListeners);
// document.addEventListener("DOMContentLoaded", checkPage);
// test

const system = new System();
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function attachListeners() {
    // document.querySelector('.login_form')?.addEventListener('submit', login);
    // let logoutButton = document.querySelector('.logout');
    // if (logoutButton) {
    //     logoutButton.addEventListener('click', logout);
    // }
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(),
          scaleX = canvas.width / rect.width,
          scaleY = canvas.height / rect.height;
      
        return {
          x: (evt.clientX - rect.left) * scaleX,
          y: (evt.clientY - rect.top) * scaleY
        }
    }
    
    const note = document.querySelector('.notes textarea');
    note.addEventListener('keydown', (event) => {
        saveFile();
    })

    // tts event listener
    const mic = document.querySelector('.mic-btn')
    mic.addEventListener('click', (event) => {
        var msg = new SpeechSynthesisUtterance();
        msg.text = document.querySelector('.notes textarea').value;
        msg.lang = 'fr-FR'
        window.speechSynthesis.speak(msg);
    })
    
    let painting = false;
    
    const penPoints = [];
    let penColor = 'black';
    let penWidth = 0.5;
    
    const highlighterPoints = [];
    let highlighterColor = 'yellow';
    let highlighterWidth = 2;

    const tools = ['p', 'e', 'h']

    let tool = tools[0];

    const useTools = (details) => {
        switch (tool) {
            case 'p':
                penDraw(details, penWidth, penColor);
                break;
            case 'e':
                penColor = 'white';
                break;
            case 'h':
                penColor = 'yellow';
                break;
        }
    }

    const penDraw = (details, width, color) => {
        const currentStroke = penPoints[penPoints.length - 1];
        let {x, y} = getMousePos(canvas, details);
        currentStroke.push({x: x, y: y});
        draw(penPoints, width, color);
    }

    // draw on mousedown
    note.addEventListener('mousedown', (event) => {
        // console.log('test')
        painting = true;
        penPoints.push([])
    });
    note.addEventListener('mouseup', (event) => {
        painting = false;
    })
    note.addEventListener('mousemove', (event) => {
        if (!painting) {return}
        event.preventDefault();
        useTools(event);
    })

    note.addEventListener('touchstart', (event) => {
        // console.log('test')
        painting = true;
        penPoints.push([])
    });
    note.addEventListener('touchend', (event) => {
        painting = false;
    })

    note.addEventListener('touchmove', (event) => {
        if (!painting) {return}
        event.preventDefault();
        useTools(event.targetTouches[0]);
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


const draw = (points, width, color) => {
    // console.log('drawing')
    points.forEach(strokes => {
        ctx.beginPath();
        strokes.forEach((point, index) => {
            if(index == 0){
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        })
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 0;
        ctx.imageSmoothingEnabled = false;
        ctx.stroke();
    })
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

