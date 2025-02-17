import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    themeMode: "dark",
};


const utilSlice = createSlice({
    name: "UTIL",
    initialState,
    reducers: {
        setThemeMode: (state, action) => {
            state.themeMode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
    },
});

export const { setThemeMode } = utilSlice.actions;
export default utilSlice.reducer;
