import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { isSupported, getAnalytics } from "firebase/analytics"; // Import Firebase Analytics
import { GoogleAuthProvider } from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const AuthWithGoogle = new GoogleAuthProvider();

// Initialize Analytics if supported
isSupported().then((supported) => {
    if (supported) {
        const analytics = getAnalytics(app);
        // Now you can use Firebase Analytics safely in supported environments
    } else {
        console.log("Firebase Analytics is not supported in this environment.");
    }
});

// Function to create a new user
export const createNewUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return { errorCode, errorMessage };  // Return error for handling elsewhere
    }
}

// Function to log in a user
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return { errorCode, errorMessage };  // Return error for handling elsewhere
    }
}



export const GoogleAuth = new GoogleAuthProvider();