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
    
    const penPoints = [[]];
    let penColor = 'black';
    let penWidth = 0.5;
    
    const highlighterPoints = [[]];
    let highlighterColor = 'yellow';
    let highlighterWidth = 2;

    const eraserWidth = 5; 
    
    const tools = ['p', 'e', 'h']
    
    let tool = tools[0];
    
    const penBtn = document.querySelector('.p');
    const eraserBtn = document.querySelector('.e');
    const highlighterBtn = document.querySelector('.h');

    penBtn.addEventListener('click', () => {tool = tools[0];})
    eraserBtn.addEventListener('click', () => {tool = tools[1];})
    highlighterBtn.addEventListener('click', () => {tool = tools[2];})
    
    const useTools = (details) => {
        switch (tool) {
            case 'p':
                penDraw(details, penWidth, penColor);
                break;

            case 'e':
                eraserDraw(details);
                break;

            case 'h':
                highlightDraw(details, highlighterWidth, highlighterColor);
                break;
        }
    }

    const pushStroke = () => {
        switch (tool) {
            case 'p':
                penPoints.push([]);
                break;

            case 'h':
                highlighterPoints.push([]);
                break;
        }
    }

    const hoverTools = (details) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.globalAlpha = 1;
        const {x, y} = getMousePos(canvas, details);
        switch (tool) {
            case 'p':
                // black dot
                ctx.arc(x, y, penWidth, 0, 2 * Math.PI);
                ctx.fillStyle = penColor;
                ctx.strokeStyle = penColor;
                ctx.lineWidth = penWidth;
                ctx.fill();

                break;

            case 'e':
                // eraser
                ctx.arc(x, y, eraserWidth, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 0.1;
                ctx.globalAlpha = 1;
                ctx.fill();
                break;

            case 'h':
                // yellow rectangle
                ctx.rect(x - highlighterWidth/2, y - highlighterWidth/2, highlighterWidth, highlighterWidth);
                // no black border
                ctx.strokeStyle = highlighterColor;
                ctx.fillStyle = highlighterColor;
                ctx.fill();
                break;
        }
        ctx.stroke();

        // draw all strokes
        draw(penPoints, penWidth, penColor);
        draw(highlighterPoints, highlighterWidth, highlighterColor, 0.5);
    }

    const penDraw = (details, width, color) => {
        const currentStroke = penPoints[penPoints.length - 1];
        let {x, y} = getMousePos(canvas, details);
        currentStroke.push({x: x, y: y});
        draw(penPoints, width, color);
    }

    const highlightDraw = (details, width, color) => {
        const currentStroke = highlighterPoints[highlighterPoints.length - 1];
        let {x, y} = getMousePos(canvas, details);
        currentStroke.push({x: x, y: y});
        draw(highlighterPoints, width, color, 0.01);
    }

    const eraserDraw = (details) => {
        // go through all points and if they are within the eraser's width, remove them
        let {x, y} = getMousePos(canvas, details);
        // console.log(x, y);
        penPoints.forEach(strokes => {
            strokes.forEach((point, index) => {
                if (Math.abs(point.x - x) < eraserWidth && Math.abs(point.y - y) < eraserWidth) {
                    strokes.splice(index, 1);
                }
            })
        })
        highlighterPoints.forEach(strokes => {
            strokes.forEach((point, index) => {
                if (Math.abs(point.x - x) < eraserWidth && Math.abs(point.y - y) < eraserWidth) {
                    strokes.splice(index, 1);
                }
            })
        })
    }
    // draw on mousedown
    note.addEventListener('mousedown', (event) => {
        painting = true;pushStroke();
    });
    note.addEventListener('mouseup', (event) => {
        painting = false;
    })
    note.addEventListener('mousemove', (event) => {
        hoverTools(event);
        if (!painting) {return}
        event.preventDefault();
        useTools(event);
    })

    note.addEventListener('touchstart', (event) => {
        painting = true;pushStroke();
    });
    note.addEventListener('touchend', (event) => {
        painting = false;
    })
    note.addEventListener('touchmove', (event) => {
        hoverTools(event.targetTouches[0]);
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


const draw = (points, width, color, transparency = 1) => {
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
        ctx.globalAlpha = transparency;
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

