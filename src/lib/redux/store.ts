import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import userUnionReducer from './features/user_unions/userUnionsSlice'

// //redux store:
// //redux is how we will implement gloabal state management to our application

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            userUnion: userUnionReducer
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']