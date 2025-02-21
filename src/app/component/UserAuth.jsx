"use client";
import { useEffect, useState, memo, useContext } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { Facebook, Google, Instagram } from "@mui/icons-material";
import { useFormik } from "formik";
import { AuthWithGoogle, auth } from "@/config/firebase";
import {
    calmAuthenticatingState,
    setLoginStatus,
    userLogin,
    userSignUp,
} from "../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { themeChangeContext } from "../context/ThemeContext";
import * as Yup from 'yup';

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
    const [value, setValue] = useState(0);
    useEffect(() => {
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
    const themeMode = useSelector((state) => state.UTIL.themeMode);
    "bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(/bg-frame.svg)]"
    return (
        <Box
            sx={{
                background: themeMode == 'dark' ? "url(/bg-frame-dark.svg)" : "url('/bg-frame.svg')",
            }}
            className={`flex h-screen w-screen items-center justify-start bg-cover bg-center bg-no-repeat text-black dark:text-white`}>
            <Box
                sx={{ width: "300px", marginInline: "auto", height: "530px", bgcolor: "background.paper" }}
                className="overflow-y-auto rounded-lg p-4 shadow-2xl"
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

const LoginSchema = Yup.object().shape({
    password: Yup.string()
        .min(2, 'Too Short!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
});

const Login = memo(() => {
    const dispatch = useDispatch();
    const authenticatingError = useSelector(
        (state) => state.AUTH.authenticatingError
    );
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            console.log(JSON.stringify(values, null, 2));
            await dispatch(
                userLogin({ email: values.email, password: values.password })
            );
            dispatch(setLoginStatus(false));
            setTimeout(() => {
                dispatch(calmAuthenticatingState());
            }, 2000);
        },
    });
    return (
        <form onSubmit={() => {
            formik.submitForm()
        }}>
            <Box className="flex flex-col gap-4">
                <Box className="flex flex-col gap-4 *:!bg-transparent">
                    <TextField
                        id="standard-basic"
                        label="Email"
                        variant="standard"
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        helpertext={formik.touched.email && formik.errors.email}
                    />
                    {formik.errors.email && formik.touched.email ? (
                        <Typography variant="caption" color="error">{formik.errors.email}</Typography>
                    ) : null}
                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        variant="standard"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password && formik.touched.password ? (
                        <Typography variant="caption" color="error">{formik.errors.password}</Typography>
                    ) : null}
                </Box>
                <Typography variant="caption" className="text-right text-red-600">
                    {authenticatingError}
                </Typography>
                <Button
                    variant="contained"
                    className="w-full"
                    onClick={formik.handleSubmit}
                    disabled={formik.isSubmitting}
                    type="submit"
                >
                    {formik.isSubmitting ? (
                        <CircularProgress color="warning" className="mr-2" size={18} />
                    ) : (
                        "Login"
                    )}
                </Button>
                <ForgottedPassword />
                <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    className="mx-auto text-center"
                >
                    or
                </Typography>
                <SocialLogin />
            </Box>
        </form>
    );
});


const SignUpSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Too Short!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string().min(6, 'Too Short!').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const SignUp = memo(() => {
    const dispatch = useDispatch();
    const router = useRouter();
    const authenticatingError = useSelector(
        (state) => state.AUTH.authenticatingError
    );
    const authenticatingState = useSelector(
        (state) => state.AUTH.authenticatingState
    );
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
        },
        validationSchema: SignUpSchema,
        onSubmit: async (values) => {
            if (!(values.confirmPassword === values.password)) {
                alert("Password does not match");
                return;
            }

            await dispatch(
                userSignUp({
                    email: values.email,
                    password: values.password,
                    router,
                    username: values.username,
                })
            );

            setTimeout(() => {
                dispatch(setLoginStatus(false));
                dispatch(calmAuthenticatingState());
            }, 2000);
        },
    });
    return (
        <form onSubmit={formik.submitForm}>
            <Box className="flex flex-col gap-4">
                <Box className="flex flex-col gap-4 *:!bg-transparent">
                    <TextField
                        id="form-username"
                        label="Username"
                        variant="standard"
                        name="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                    {formik.errors.username && formik.touched.username ? (
                        <Typography variant="caption" color="error">{formik.errors.username}</Typography>
                    ) : null}
                    <TextField
                        id="standard-basic"
                        label="EMAIL"
                        variant="standard"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email ? (
                        <Typography variant="caption" color="error">{formik.errors.email}</Typography>
                    ) : null}
                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        variant="standard"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password && formik.touched.password ? (
                        <Typography variant="caption" color="error">{formik.errors.password}</Typography>
                    ) : null}
                    <TextField
                        id="standard--confirmPassword-input"
                        label="Confirm Password"
                        type="password"
                        variant="standard"
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                    />
                    {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                        <Typography variant="caption" color="error">{formik.errors.confirmPassword}</Typography>
                    ) : null}
                </Box>
                <Typography variant="caption" className="text-right text-red-600">
                    {authenticatingError}
                </Typography>
                <Button
                    variant="contained"
                    className="w-full"
                    onClick={formik.handleSubmit}
                    disabled={
                        formik.isSubmitting ||
                        authenticatingState === "loading" ||
                        authenticatingState === "success"
                    }
                    type="submit"
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
        </form>
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
                            const errorCode = error?.code;
                            const errorMessage = error?.message;
                            // The email of the user's account used.
                            const email = error?.customData?.email;
                            // The AuthCredential type that was used.
                            const credential = GoogleAuthProvider?.credentialFromError(error);

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
                sx={{
                    color: "var(--mui-palette-action-active)",
                }}
            >
                <Google />
            </Button>
        </ButtonGroup>
        <ButtonGroup size="small" aria-label="Small button group">
            <Button sx={{
                color: "var(--mui-palette-action-active)",
            }} variant="contained" className="w-full">
                <Facebook />
            </Button>
        </ButtonGroup>
        <ButtonGroup size="small" aria-label="Small button group">
            <Button sx={{
                color: "var(--mui-palette-action-active)",
            }} variant="contained" className="w-full">
                <Instagram />
            </Button>
        </ButtonGroup>
    </Box>
);

const ForgottedPassword = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const formik = useFormik({
        initialValues: {
            email: "",
        },
        onSubmit: async (values) => {
            // Handle password reset logic here
            console.log("Password reset email sent to:", values.email);
            handleClose();
        },
    });
    return (
        <>
            <Button
                className="m-0 ml-auto p-0 text-right"
                variant="caption"
                sx={{ color: "primary.contrastText" }}
                onClick={handleClickOpen}
            >
                Forgot password?
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Reset Password"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Enter your email address below and we'll send you a link to reset
                        your password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={formik.handleSubmit} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
