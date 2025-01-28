"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Button,
    ButtonGroup,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { Facebook, Google, Instagram } from "@mui/icons-material";
import { useFormik } from "formik";
import { AuthWithGoogle, createNewUser, loginUser } from "@/config/firebase";
import { auth } from "@/lib/firebase.config";
import { useAppDispatch } from "../redux/hook";
import {
    login,
    logout,
    setLoginStatus,
    userLogin,
} from "../redux/slice/userSlice";
import { useDispatch, useStore } from "react-redux";
import store from "../redux/store";
import { getAuth, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { authStateChangeHandler } from "../lib/authStateChangeHandler";
import { redirect, useRouter } from "next/navigation";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </Box>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export function Auth() {
    const router = useRouter();
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                try {
                    router.push("/home");
                } catch (error) {
                    console.log("Failed while trying to redirect");
                    console.log("Error: ", error);
                }
            }
        });
    }, []);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Box className="flex h-screen w-screen items-center justify-start bg-[url(/bg-frame.svg)] bg-cover bg-center bg-no-repeat text-black dark:text-white">
            <Box
                sx={{ width: "300px", marginInline: "auto", height: "500px" }}
                className="rounded-lg bg-white p-4 shadow-2xl"
            >
                <Box>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        sx={{ width: "100%" }}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Login" {...a11yProps(0)} sx={{ width: "50%" }} />
                        <Tab label="Sign up" {...a11yProps(1)} sx={{ width: "50%" }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Login />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <SignUp />
                </CustomTabPanel>
            </Box>
        </Box>
    );
}

const Login = React.memo(() => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            email: "abc@gmail.com",
            password: "123123",
        },
        onSubmit: async (values) => {
            console.log(JSON.stringify(values, null, 2));
            await dispatch(
                userLogin({ email: values.email, password: values.password })
            );
        },
    });
    return (
        <Box className="flex flex-col gap-4">
            <Box className="flex flex-col gap-4 *:!bg-transparent">
                <TextField
                    id="standard-basic"
                    label="EMAIL"
                    variant="standard"
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    variant="standard"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
            </Box>
            <Button
                variant="contained"
                className="w-full"
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
            >
                {formik.isSubmitting ? (
                    <CircularProgress color="warning" className="mr-2" size={18} />
                ) : (
                    "Login"
                )}
            </Button>
            <Link className="m-0 text-end" variant="caption" href="#">
                Forgot password?
            </Link>
            <Typography
                variant="subtitle1"
                color="textSecondary"
                className="mx-auto text-center"
            >
                or
            </Typography>
            <SocialLogin />
        </Box>
    );
});

const SignUp = React.memo(() => {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: (values) => {
            console.log(JSON.stringify(values, null, 2));
        },
    });
    return (
        <Box className="flex flex-col gap-4">
            <Box className="flex flex-col gap-4 *:!bg-transparent">
                <TextField
                    id="standard-basic"
                    label="EMAIL"
                    variant="standard"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    variant="standard"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <TextField
                    id="standard--confirmPassword-input"
                    label="Confirm Password"
                    type="password"
                    variant="standard"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                />
            </Box>
            <Button
                variant="contained"
                className="w-full"
                onClick={formik.handleSubmit}
            >
                Sign Up
            </Button>
            <Typography
                variant="subtitle1"
                color="textSecondary"
                className="mx-auto text-center"
            >
                or
            </Typography>
            <SocialLogin />
        </Box>
    );
});

const SocialLogin = () => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            marginInline: "auto",
            "& > *": {
                m: 1,
            },
        }}
    >
        <ButtonGroup size="small" aria-label="Small button group">
            <Button
                variant="contained"
                className="w-full"
                onClick={() => {
                    signInWithPopup(auth, AuthWithGoogle)
                        .then((result) => {
                            // This gives you a Google Access Token. You can use it to access the Google API.
                            const credential =
                                GoogleAuthProvider.credentialFromResult(result);
                            const token = credential.accessToken;
                            // The signed-in user info.
                            const user = result.user;
                            // IdP data available using getAdditionalUserInfo(result)
                            // ...
                            console.log(
                                "User: ",
                                user,
                                "Token: ",
                                token,
                                "Credential: ",
                                credential
                            );
                        })
                        .catch((error) => {
                            // Handle Errors here.
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            // The email of the user's account used.
                            const email = error.customData.email;
                            // The AuthCredential type that was used.
                            const credential = GoogleAuthProvider.credentialFromError(error);

                            // ...

                            console.log(
                                "Error: ",
                                errorCode,
                                errorMessage,
                                email,
                                credential
                            );
                        });
                }}
            >
                <Google />
            </Button>
        </ButtonGroup>
        <ButtonGroup size="small" aria-label="Small button group">
            <Button variant="contained" className="w-full">
                <Facebook />
            </Button>
        </ButtonGroup>
        <ButtonGroup size="small" aria-label="Small button group">
            <Button variant="contained" className="w-full">
                <Instagram />
            </Button>
        </ButtonGroup>
    </Box>
);
