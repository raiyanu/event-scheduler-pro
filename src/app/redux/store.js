import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import userReducer from './slice/userSlice.js'

const rootReducer = combineReducers({
    AUTH: userReducer,
})

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
})

export default store;