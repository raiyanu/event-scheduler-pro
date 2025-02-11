import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "./slice/userSlice.js";
import taskReducer from "./slice/taskSlice.js";

const rootReducer = combineReducers({
    AUTH: userReducer,
    TASK: taskReducer,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export default store;
