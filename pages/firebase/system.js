// import firebase SDK modules
import {onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { initializeApp} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, get, onDisconnect } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";


// import firebaseConfig from './config.js';
import firebaseConfig from './config.js';

// const firebaseConfig = firebaseConfig;
import {nanoid} from 'https://cdnjs.cloudflare.com/ajax/libs/nanoid/3.3.4/nanoid.min.js'

// Initialize Firebase
class System {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getDatabase(this.app);
    
        // this.analytics = getAnalytics(this.app);

        // user details
        this.userRef = null;
        this.user = null;
        this.uid = null;

        onAuthStateChanged(this.auth, (user) => {
            this.onAuthStateChanged(user);
        })
    }

    // user details
    onAuthStateChanged(user){
        if(user){
            console.log(user)
            this.user = user;
            this.userRef = ref(this.db, 'users/' + this.user.uid);
            this.uid = this.user.uid;

            // get user data
            get(this.userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const user = snapshot.val();
                    console.log(user)
                } else {
                    console.log("creating user data");

                    this.setData(this.userRef, {
                        name: 'username',
                        id: user.uid,
                        notes: [
                            {
                                id: nanoid(8),
                                title: 'My First Note',
                                content: 'This is my first note'
                            }
                        ]
                    })
                }
            })

            // onDisconnect(this.userRef).remove();

        } else {
            this.user = null;
            this.userRef = null;
            this.uid = null;
        }
    }

    async signIn(email, password){
        await signInWithEmailAndPassword(this.auth, email, password)
        .then ((userCredential) => {
            let user = userCredential.user;
        })
        
        .catch((error) => {
            let invalidLoginDiv = document.querySelector('.invalid-login')
            invalidLoginDiv.innerHTML = 'Incorrect email or password.'
            let errorCode = error.code;
            let errorMessage = error.message;
        
            console.log(errorCode, errorMessage);
        })
    }

    async register(email, password, username){
        console.log('registering')
        createUserWithEmailAndPassword(this.auth, email, password)
        .then ((userCredential) => {
            let user = userCredential.user;
            console.log(user)
            this.setData(ref(this.db, 'users/' + user.uid), {
                name: username,
                id: user.uid,
                notes: [
                    {
                        id: nanoid(8),
                        timestamp: Date.now(),
                        title: `${username}'s First Note`,
                        content: 'This is my first note'
                    }
                ]
            })
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (error.code == 'auth/invalid-email') {
                document.querySelector('.invalid-email').innerHTML = 'Invalid email!'
            } else if (!username) {
                document.querySelector('.invalid-username').innerHTML = 'Missing username!'
            } else if (error.code == 'auth/missing-password') {
                document.querySelector('.invalid-password').innerHTML = 'Missing password!'
            } else if (error.code == 'auth/weak-password') {
                document.querySelector('.invalid-password').innerHTML = 'Must be at least 6 characters long!'
            } else if (error.code == 'auth/email-already-in-use') {
                document.querySelector('.invalid-email').innerHTML = 'Email already in use!'
            }
            console.log(errorCode, errorMessage);
        })
    }

    async setData(ref, data){
        await set(ref, data);
    }

    async getData(ref){
        // console.log(await get(ref))
        return await get(ref);
    }

    // sign the user out
    async signOut(){
        await signOut(this.auth).then(() => {
            console.log('signed out')
            // remove user data
        }).catch((error) => {
            console.log(error)
        })
    }

    appendLogoutButton(element){
        element.addEventListener('click', () => {
            this.signOut();
        })
    }
}

const system = new System();

export default System;