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
                                id: nanoid(),
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
            let errorCode = error.code;
            let errorMessage = error.message;
        
            console.log(errorCode, errorMessage);
        })
    }

    async register(email, password){
        await createUserWithEmailAndPassword(this.auth, email, password)
        .then ((userCredential) => {
            let user = userCredential.user;
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
        
            console.log(errorCode, errorMessage);
        })
    }

    async setData(ref, data){
        await set(ref, data);
    }

    async getData(ref, data){
        return await get(ref, data);
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