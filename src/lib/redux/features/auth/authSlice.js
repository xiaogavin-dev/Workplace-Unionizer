import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { auth } from "../../../../firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"

export const listenToAuthChanges = createAsyncThunk(
    'auth/listenToAuthChanges',
    async (_, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                console.log("AUTH STATE CHANGED...");
                console.log("_______________________________________________________________");
                console.log(auth.currentUser)
                if (user) {
                    dispatch(setAuthState({
                        isAuthenticated: true,
                        isLoading: false,
                        user: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                        }
                    }));
                } else {
                    console.log("No user is logged in")
                    dispatch(setAuthState({
                        isAuthenticated: false,
                        isLoading: false,
                        user: null,
                    }));
                }
                resolve();
            }, (error) => {
                console.error('Auth state change error', error);
                reject(error);
            });

            return unsubscribe;
        });
    }
);
// Auth slice definition
export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        isLoading: false,
        user: null,
    },
    reducers: {
        setAuthState: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.isLoading = action.payload.isLoading;
            state.user = action.payload.user;
        },
    },
});

export const { setAuthState } = authSlice.actions
export default authSlice.reducer