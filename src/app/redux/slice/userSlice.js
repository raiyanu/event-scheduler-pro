import { loginUser } from "@/config/firebase";
import { auth } from "@/lib/firebase.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    loginStatus: false,
    authenticatingState: 'idle',
};

export const userLogin = createAsyncThunk('auth/Login', async (payload, { rejectWithValue }) => {
    try {
        console.log("payload: ", payload);
        const res = await loginUser(payload.email, payload.password);
        console.log("res: ", res);
        if (res) {
            return res;
        } else {
            return rejectWithValue(new Error(res.message))
        }
    } catch (error) {
        return rejectWithValue(new Error(res.message))
    }
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = {};
        },
        setLoginStatus: (state, action) => {
            state.loginStatus = action.payload;
        },
        selectors: (state) => state.user,
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.authenticatingState = 'loading';
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                const userInfo = extractUserInfo(action.payload);
                state.authenticatingState = 'succeeded';
                state.user = userInfo;
                state.loginStatus = true;
            })
            .addCase(userLogin.rejected, (state) => {
                state.authenticatingState = 'failed';
                state.loginStatus = false;
            });
    }
});

export const authStateChanged = () => {
    return (dispatch) => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                dispatch(setUser(user));
            } else {
                dispatch(clearUser());
            }
        });
    };
};


export const selectUser = (state) => state.user.user;
export const { logout, setLoginStatus } = userSlice.actions;
export default userSlice.reducer;




function extractUserInfo(userData) {
    // Extracting necessary fields from the provided object
    const userInfo = {
        uid: userData.user.uid, // User unique identifier
        email: userData.user.email, // User email
        emailVerified: userData.user.emailVerified, // Whether the email is verified
        isAnonymous: userData.user.isAnonymous, // Whether the user is anonymous
        displayName: userData.user.providerData[0].displayName || 'No Display Name' // Display name, fallback if null
    };

    // Return the extracted user info
    return userInfo;
}