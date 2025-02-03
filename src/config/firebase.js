import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendSignInLinkToEmail,
    sendEmailVerification,
    applyActionCode,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    collection,
    query,
    updateDoc,
    addDoc,
    setDoc,
} from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const AuthWithGoogle = new GoogleAuthProvider();
export const GoogleAuth = new GoogleAuthProvider();

// Function to create
async function registerUser(email, password, username, name) {
    // Check if the username already exists
    const usernameTaken = await isUsernameTaken(username);
    if (usernameTaken) {
        console.error("Username already taken! Choose another.");
        return { success: false, message: "Username is already taken" };
    }

    try {
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Store user details in Firestore (both in users and username collections)
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            name: name,
            username: username,
            createdAt: new Date(),
        });

        // Store username as a document to prevent duplicate usernames
        await setDoc(doc(db, "username", username), {
            uid: user.uid,
        });

        console.log("User registered successfully!");
        return { success: true, user };
    } catch (error) {
        console.error("Error creating user:", error.message);
        return { success: false, message: error.message };
    }
}

// Function to create a new user
export const createNewUser = async ({ email, password, username }) => {
    console.log("Creating new user...");
    console.log(email, password, username);
    try {
        const usernameTaken = await isUsernameTaken(username);
        if (usernameTaken) {
            console.log(usernameTaken);
            console.error("Username already taken! Choose another.");
            return { ok: false, errorCode: "auth/Username-is-already-taken" };
        }
        await occupyUsername(username);

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        console.log(user);
        return { ...user, ok: true };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return { errorCode, errorMessage, ok: false }; // Return error for handling elsewhere
    }
};

// Function to log in a user
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        console.log(user);
        return { ...user, ok: true };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return { errorCode, errorMessage, ok: false }; // Return error for handling elsewhere
    }
};

export const isUsernameTaken = async (username) => {
    console.log(username);
    const usernameRef = doc(db, "username", username);
    const usernameSnap = await getDoc(usernameRef);
    console.log(usernameSnap);
    console.log(usernameSnap.data());
    console.log(usernameSnap.exists())
    console.log(usernameSnap.exists);
    return usernameSnap.exists() ? true : false; // Explicitly return false if the document does not exist
};

export const occupyUsername = async (username) => {
    try {
        console.log("Occupying username...");
        const usernameRef = doc(db, "username", username);
        await setDoc(usernameRef, {});
        console.log("Occupying username successful!");
        return { ok: true };
    } catch (error) {
        console.error("Error occupying username:", error.message);
        return {
            ok: false,
            message: error,
        };
    }
};

export const getUserFullInfo = async () => {
    const userFullInfo = await getDoc(doc(db, "users", auth.currentUser.uid));
    return userFullInfo;
};

export const updateUserInfo = async (newData) => {
    try {
        const myuserDooc = doc(db, "users", auth.currentUser.uid);
        const isExists = await getDoc(myuserDooc);
        if (!isExists.exists()) {
            await setDoc(doc(db, "users", auth.currentUser.uid), newData);
            // addDoc(collection(db, "users", auth.currentUser.uid), newData);
        } else {
            await updateDoc(myuserDooc, newData);
        }
    } catch (error) {
        console.error("Error updating user info:", error.message);
        return false;
    }
    return true;
};

export const validateUserEmail = async () => {
    const lastTriggered = localStorage.getItem("lastEmailVerificationTime");
    const now = new Date().getTime();

    if (lastTriggered && now - lastTriggered < 2 * 60 * 1000) {
        console.log("Email verification can only be triggered after 2 minutes.");
        return {
            ok: false,
            message: "Email verification can only be triggered after 2 minutes.",
        };
    }
    await sendEmailVerification(auth.currentUser)
        .then(() => {
            window.localStorage.setItem("emailForSignIn", auth.currentUser?.email);
            localStorage.setItem("lastEmailVerificationTime", now);
            console.log("Link sent");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return { errorCode, errorMessage, ok: false }; // Return error for handling elsewhere
        });
    return { ok: true };
};

export const resetPassword = async (email) => {
    const lastTriggered = localStorage.getItem("lastResetPasswordLinkTime");
    const now = new Date().getTime();

    if (lastTriggered && now - lastTriggered < 2 * 60 * 1000) {
        console.log("Password reset link can only be triggered after 2 minutes.");
        return {
            ok: false,
            message: "Password reset link can only be triggered after 2 minutes.",
        };
    }

    await sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset link sent");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(
                "Error sending password reset link:",
                errorCode,
                errorMessage
            );
        });
    return { ok: true };
};

export const getTaskList = async () => {
    if (!auth.currentUser) {
        return [];
    };
    const taskListRef = collection(db, "users", auth.currentUser?.uid, "tasks");
    const taskList = await getDocs(taskListRef);
    return [...taskList.docs.map((doc) => ({ ...doc.data(), id: doc.id }))];
}