"use client";
import {
    Badge,
    Box,
    Button,
    Grid,
    Grid2,
    IconButton,
    Popover,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import MainLayout from "../PrimaryLayout";
import { ThemeProvider } from "@emotion/react";
import { Theme } from "../context/ThemeContext";
import { useSelector } from "react-redux";
import { isLogged as logChecker } from "../redux/slice/userSlice";
import {
    AccountBox,
    AccountCircle,
    Close,
    Edit,
    FileUpload,
    FileUploadSharp,
    GppMaybe,
    Label,
    Upload,
    Verified,
    VerifiedUser,
} from "@mui/icons-material";
import { useState } from "react";
import { useFormik } from "formik";
import { updateUserInfo, validateUserEmail } from "@/config/firebase";

export default function page() {
    return (
        <MainLayout>
            <Typography
                sx={{
                    color: "primary.main",
                }}
                variant="h4"
            >
                Settings
            </Typography>
            <UserSettingsContainer />
        </MainLayout>
    );
}
const UserSettingsContainer = () => {
    const isLogged = useSelector((state) => state.AUTH.loginStatus);
    const [isEditing, setIsEditing] = useState(false);
    return (
        <Typography
            sx={{
                color: "primary.main",
            }}
            variant="h6"
        >
            {!isLogged && <Typography>Login to continue</Typography>}
            {isLogged && (
                <UserSettings isEditing={isEditing} setIsEditing={setIsEditing} />
            )}
        </Typography>
    );
};

const UserSettings = ({ isEditing, setIsEditing }) => {
    const userInfo = useSelector((state) => state.AUTH.user);
    const formik = useFormik(userSettingActionFormConfig(userInfo));
    return (
        <Box className="mx-2 h-full lg:mx-8">
            <Typography variant="subtitle1" color="textSecondary" className="my-4">
                Account Information
            </Typography>
            <Box className="mt-8 flex w-full justify-between *:flex-grow-0">
                <Box className="flex max-w-lg items-center">
                    <Box>
                        <Badge
                            badgeContent={<FileUploadSharp color="action" />}
                            overlap="circular"
                            className="cursor-pointer bg-transparent hover:opacity-80"
                        >
                            <AccountCircle color="disabled" sx={{ fontSize: 100 }} />
                        </Badge>
                    </Box>
                    <Box className="ml-4 flex flex-col items-center">
                        {isEditing ? (
                            <TextField
                                variant="outlined"
                                label="Display Name"
                                name="displayName"
                                value={formik.values.displayName}
                                onChange={formik.handleChange}
                            />
                        ) : (
                            <Typography variant="h4" color="textPrimary">
                                {userInfo.displayName}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Tooltip title="Edit profile">
                    <IconButton
                        variant="text"
                        size="medium"
                        className="h-8"
                        color="primary"
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        {isEditing ? <Close /> : <Edit />}
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ flexGrow: 1, marginTop: "2rem" }}>
                <Box className="flex grid-cols-[1fr_1fr] flex-col gap-6 lg:grid">
                    <Box className="col-span-2">
                        <Box className="flex items-center"></Box>
                        {isEditing ? (
                            <TextField
                                variant="outlined"
                                label="Username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                            />
                        ) : (
                            <>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Username
                                </Typography>
                                <Typography variant="h5" color="textPrimary" className="">
                                    {userInfo.username ? userInfo.username : "No Username"}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box>
                        {isEditing ? (
                            <TextField
                                variant="outlined"
                                label="First Name"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                            />
                        ) : (
                            <>
                                <Box className="flex items-center">
                                    <Typography variant="subtitle2" color="textSecondary">
                                        First Name
                                    </Typography>
                                </Box>
                                <Typography variant="h5" color="textPrimary" className="">
                                    {userInfo.firstName ? userInfo.firstName : "Not provided"}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box>
                        {isEditing ? (
                            <TextField
                                variant="outlined"
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                            />
                        ) : (
                            <>
                                <Box className="flex items-center">
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Last Name
                                    </Typography>
                                </Box>
                                <Typography variant="h5" color="textPrimary" className="">
                                    {userInfo.lastName ? userInfo.lastName : "Not provided"}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box>
                        {isEditing ? (
                            <TextField
                                variant="outlined"
                                label="Phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                            />
                        ) : (
                            <>
                                <Box className="flex items-center">
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Phone
                                    </Typography>
                                </Box>
                                <Typography variant="h5" color="textPrimary" className="">
                                    {userInfo.phone ? userInfo.phone : "No Phone"}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box>
                        <Box className="flex items-center">
                            <Typography variant="subtitle2" color="textSecondary">
                                Email
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            color="textPrimary"
                            className="flex items-center gap-2"
                        >
                            {userInfo.emailVerified ? (
                                <Tooltip title="Email is verified">
                                    {userInfo.email ? userInfo.email : "No Email"}
                                    <VerifiedUser color="info" />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Email is Not Verified!">
                                    {userInfo.email ? userInfo.email : "No Email"}
                                    <Button variant="outlined" color="warning" className="ml-2" onClick={() => {
                                        validateUserEmail();
                                    }}>
                                        <GppMaybe color="warning" />{" "} Verify
                                    </Button>
                                </Tooltip>
                            )}
                        </Typography>
                    </Box>
                </Box>
                {isEditing && (
                    <Box className="mt-8 flex flex-col-reverse gap-4">
                        <Button
                            variant="contained"
                            color="primary"
                            className="ml-auto mt-8"
                            onClick={formik.handleSubmit}
                        >
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const userSettingActionFormConfig = (userInfo) => ({
    initialValues: {
        username: userInfo.username,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: userInfo.phone,
        displayName: userInfo.displayName,
    },
    onSubmit: async (values) => {
        console.log(JSON.stringify(values, null, 2));
        if (await updateUserInfo(values)) {
            console.log("User info updated successfully");
        } else {
            console.error("User info update failed");
        }
    },
});
