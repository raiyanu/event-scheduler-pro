import { createNewUser, loginUser } from "@/config/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        uid: null,
        email: null,
        emailVerified: null,
        isAnonymous: null,
        displayName: null
    },
    loginStatus: false,
    authenticatingState: 'idle',
};

export const userLogin = createAsyncThunk('auth/Login', async (payload, { rejectWithValue }) => {
    try {
        const res = await loginUser(payload.email, payload.password);
        if (res) {
            return res;
        } else {
            return rejectWithValue(new Error(res.message))
        }
    } catch (error) {
        return rejectWithValue(new Error(res.message))
    }
})
export const userSignUp = createAsyncThunk('auth/SignUp', async (payload, { rejectWithValue }) => {
    try {
        console.log("dispatched")
        const res = await createNewUser(payload.email, payload.password);
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
    name: "AUTH",
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload;
            state.loginStatus = true;
        },
        logout: (state) => {
            state.user = {};
            state.loginStatus = false;
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
            })
            .addCase(userSignUp.pending, (state) => {
                state.authenticatingState = 'loading';
            })
            .addCase(userSignUp.fulfilled, (state, action) => {
                const userInfo = extractUserInfo(action.payload);
                state.authenticatingState = 'succeeded';
                state.user = userInfo;
                state.loginStatus = true;
            })
            .addCase(userSignUp.rejected, (state) => {
                state.authenticatingState = 'failed';
                state.loginStatus = false;
            });
    },
    selectors: (state) => state.user,
});



export const selectUser = (state) => state.AUTH.user;
export const { logout, setLoginStatus, updateUser } = userSlice.actions;
export default userSlice.reducer;

export const getUser = (state) => {
    return state.AUTH.user;
};

export const isLogged = (state) => {
    return state.AUTH.loginStatus;
};



export function extractUserInfo(userData) {
    // Extracting necessary fields from the provided object
    const userInfo = {
        ...userData.providerData[0],
        displayName: userData.providerData[0].displayName ? userData.providerData[0].displayName : "User",
    };
    return userInfo;
}



// export const authStateChanged = () => {
//     return (dispatch) => {
//         auth().onAuthStateChanged((user) => {
//             if (user) {
//                 dispatch(setUser(user));
//             } else {
//                 dispatch(clearUser());
//             }
//         });
//     };
// };