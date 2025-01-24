// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCc61n8Vns1wj4147XqR0Nawrqb59Nz5E8",
    authDomain: "event-scheduler-pro.firebaseapp.com",
    projectId: "event-scheduler-pro",
    storageBucket: "event-scheduler-pro.firebasestorage.app",
    messagingSenderId: "1090675003795",
    appId: "1:1090675003795:web:dcbdada5290784a42d5866",
    measurementId: "G-1HWNKKWB20",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
import { GoogleAuthProvider } from "firebase/auth";

export const GoogleAuth = new GoogleAuthProvider();

export function signIn() {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}
