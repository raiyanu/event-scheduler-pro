// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
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
    measurementId: "G-1HWNKKWB20"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            return error;
        });
}
export const loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            return error;
        });
}

// export const analytics = getAnalytics(app);