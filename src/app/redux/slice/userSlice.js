import {
    createNewUser,
    isUsernameTaken,
    loginUser,
    occupyUsername,
} from "@/config/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        uid: null,
        email: null,
        emailVerified: null,
        isAnonymous: null,
        displayName: null,
    },
    loginStatus: false,
    authenticatingState: "idle",
    authenticatingError: null,
};

export const userLogin = createAsyncThunk(
    "auth/Login",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await loginUser(payload.email, payload.password);
            if (res.ok) {
                return res;
            } else {
                return rejectWithValue(new Error(res.errorCode));
            }
        } catch (error) {
            return rejectWithValue(new Error(res.message));
        }
    }
);

export const userSignUp = createAsyncThunk(
    "auth/SignUp",
    async (payload, { rejectWithValue }) => {
        try {
            console.log("dispatched");
            await occupyUsername(payload.username);
            console.log("Username is taken");
            const res = await createNewUser({
                email: payload.email,
                password: payload.password,
                username: payload.username,
            });
            if (res.ok) {
                await occupyUsername(payload.username);
                return { ...res, router: payload.router };
            } else {
                return rejectWithValue(new Error(res.errorCode));
            }
        } catch (error) {
            return rejectWithValue(new Error(res.message));
        }
    }
);

const userEngagingError = [
    "invalid credential",
    "email already in use",
    "Username is already taken",
];

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
        calmAuthenticatingState: (state) => {
            state.authenticatingState = "idle";
            state.authenticatingError = null;
        },
        selectors: (state) => state.user,
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.authenticatingState = "loading";
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                const userInfo = extractUserInfo(action.payload);
                state.authenticatingState = "succeeded";
                state.user = userInfo;
                state.loginStatus = true;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.authenticatingState = "failed";
                state.loginStatus = false;
                let catchErrorMessage = action.payload.message
                    .split("/")[1]
                    .split("-")
                    .join(" ");
                userEngagingError.includes(catchErrorMessage)
                    ? (state.authenticatingError = catchErrorMessage)
                    : (state.authenticatingError = "An unexpected ERROR occured");
            })
            .addCase(userSignUp.pending, (state) => {
                state.authenticatingState = "loading";
            })
            .addCase(userSignUp.fulfilled, (state, action) => {
                const userInfo = extractUserInfo(action.payload);
                state.authenticatingState = "succeeded";
                state.user = userInfo;
                state.loginStatus = true;
                action.payload.router.push("/home");
            })
            .addCase(userSignUp.rejected, (state, action) => {
                console.log(action.payload.message.split("/")[1].split("-").join(" "));
                state.authenticatingState = "failed";
                state.authenticatingError = action.payload.message
                    .split("/")[1]
                    .split("-")
                    .join(" ");
                state.loginStatus = false;
            });
    },
    selectors: (state) => state.user,
});

export const selectUser = (state) => state.AUTH.user;
export const { logout, setLoginStatus, updateUser, calmAuthenticatingState } =
    userSlice.actions;
export default userSlice.reducer;

export const getUser = (state) => {
    return state.AUTH.user;
};

export const isLogged = (state) => {
    return state.AUTH.loginStatus;
};

export function extractUserInfo(userData) {
    const userInfo = {
        displayName: userData.displayName ? userData.displayName : null,

        photoURL: userData.providerData[0].photoURL,
        emailVerified: !!userData.emailVerified,
        uid: userData?.uid ? userData.uid : null,
        email: userData?.email ? userData.email : null,
        isAnonymous: userData?.isAnonymous ? userData.isAnonymous : null,
        firstName: userData?.firstName ? userData.firstName : null,
        lastName: userData?.lastName ? userData.lastName : null,
        phone: userData?.phone ? userData.phone : null,
        username: userData?.username ? userData.username : null,
        secondMail: userData?.secondMail ? userData.secondMail : null,
        phone: userData?.phone ? userData.phone : null,
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
