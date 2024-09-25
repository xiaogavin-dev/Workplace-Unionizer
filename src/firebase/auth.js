import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile, setPersistence, browserSessionPersistence } from 'firebase/auth'

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)

}
export const doSignInWithEmailAndPassword = (email, password) => {
    // Set persistence (local by default)
    setPersistence(auth, browserSessionPersistence)
        .then(() => {
            // Now you can use signInWithEmailAndPassword() or any other auth method
            return signInWithEmailAndPassword(auth, email, password)
        })
        .catch((error) => {
            console.error("Error setting persistence:", error);
        });
    return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider)
    return result
}

export const doSignOut = () => {
    console.log("signing out...")
    return auth.signOut()
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email)
}
export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password)
}

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`
    })
}