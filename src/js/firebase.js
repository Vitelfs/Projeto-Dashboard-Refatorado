import "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore-compat.js";

//Singleton


class Firebase {
    constructor() {
        this.app = firebase.initializeApp({
            apiKey: "AIzaSyCv-d62qZjOju7QgaFjzPDnmYxP-ksAOO8",
            authDomain: "projeto-dashboard-5eaa5.firebaseapp.com",
            projectId: "projeto-dashboard-5eaa5",
            storageBucket: "projeto-dashboard-5eaa5.appspot.com",
            messagingSenderId: "564747759056",
            appId: "1:564747759056:web:1966621ab8b8fff6f11dd5",
            measurementId: "G-YR3S16VSJR"
        });

        this.auth = firebase.auth();
        this.db = firebase.firestore();
    }

    getAuth() {
        return this.auth;
    }

    getDb() {
        return this.db;
    }

    static getInstance() {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }
        return Firebase.instance;
    }
}

export default Firebase;
