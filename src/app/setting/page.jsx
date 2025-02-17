"use client";
import {
    Badge,
    Box,
    Button,
    IconButton,
    styled,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import MainLayout from "../PrimaryLayout";
import { useDispatch, useSelector } from "react-redux";
import { userLogout, updateUser } from "../redux/slice/userSlice";
import {
    AccountCircle,
    Close,
    Edit,
    FileUploadSharp,
    GppMaybe,
    VerifiedUser,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateUserInfo, validateUserEmail } from "@/config/firebase";
import Image from "next/image";

export default function page() {
    return (
        <MainLayout>
            <UserSettings />
        </MainLayout>
    );
}

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const UserSettings = () => {
    const userInfo = useSelector((state) => state.AUTH.user);
    const formik = useFormik({
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
                formik.setValues(values);
                dispatch(updateUser(values));
                setIsEditing(false);
            } else {
                console.error("User info update failed");
            }
        },
    });
    const isLogged = useSelector((state) => state.AUTH.loginStatus);
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        formik.setValues(userInfo);
    }, [userInfo]);

    const data = [
        {
            name: "username",
            label: "Username",
            displayValue: userInfo.username ? userInfo.username : "No Username",
        },
        {
            name: "firstName",
            label: "First Name",
            displayValue: userInfo.firstName ? userInfo.firstName : "Not provided",
        },
        {
            name: "lastName",
            label: "Last Name",
            displayValue: userInfo.lastName ? userInfo.lastName : "Not provided",
        },
        {
            name: "phone",
            label: "Phone",
            displayValue: userInfo.phone ? userInfo.phone : "No Phone",
        },
    ];

    return !isLogged ? (
        <Box className="px-3 md:px-4">
            <Typography
                sx={{
                    color: "primary.main",
                }}
                variant="h4"
            >
                Settings
            </Typography>
            <Typography>Login to continue</Typography>
        </Box>
    ) : (
        <form
            onSubmit={formik.submitForm}
            className="block max-h-full overflow-y-scroll px-3 pb-24 max-sm:mx-auto md:px-6"
        >
            <Typography
                sx={{
                    color: "primary.main",
                }}
                variant="h4"
            >
                Settings
            </Typography>
            <Box className="flex items-center justify-between gap-4">
                <Typography variant="subtitle1" color="textSecondary" className="my-4">
                    Account Information
                </Typography>
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
            <Box className="mt-4 flex w-full *:flex-grow-0 max-sm:justify-center">
                <Box className="flex max-w-lg items-center max-sm:flex-col max-sm:justify-center">
                    <IconButton
                        component="label"
                        role={undefined}
                        variant="text"
                        tabIndex={-1}
                    >
                        <Badge
                            badgeContent={<FileUploadSharp color="action" />}
                            overlap="circular"
                            className="cursor-pointer bg-transparent hover:opacity-80"
                        >
                            {userInfo.photoURL ? (
                                <Image src={userInfo.photoURL} />
                            ) : (
                                <Box>
                                    <AccountCircle color="disabled" sx={{ fontSize: 100 }} />
                                </Box>
                            )}
                        </Badge>
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={async (event) => {
                                try {
                                    console.log(event.target.files);
                                    const file = event.target.files[0];

                                    const formData = new FormData();
                                    formData.append("image", file);
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                        />
                    </IconButton>
                    <Box className="flex flex-col items-start">
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
                                <Typography variant="h5" color="textPrimary" className="">
                                    {userInfo.username ? userInfo.username : "No Username"}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    marginTop: "2rem",
                    width: {
                        xs: "fit-content",
                        md: "auto",
                    },
                    marginInline: "auto",
                }}
            >
                <Box
                    className={`flex grid-cols-[1fr_1fr] flex-col  ${isEditing ? "items-center" : ""} gap-6 md:grid max-sm:px-2`}
                >
                    <Box className="col-span-2">
                        <Box className="flex items-center"></Box>
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
                                <Tooltip title="Email is verified" placement="top-end">
                                    {userInfo.email ? userInfo.email : "No Email"}{" "}
                                    <VerifiedUser color="info" />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Email is Not Verified!" placement="top-end">
                                    {userInfo.email ? userInfo.email : "No Email"}{" "}
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        className="ml-2"
                                        onClick={() => {
                                            validateUserEmail();
                                        }}
                                        size="small"
                                        sx={{ ml: 2 }}
                                    >
                                        <GppMaybe color="warning" /> Verify
                                    </Button>
                                </Tooltip>
                            )}
                        </Typography>
                    </Box>
                </Box>
                {isEditing && (
                    <Box
                        sx={{
                            mt: 8,
                            display: "flex",
                            flexDirection: "column-reverse",
                            gap: 4,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ ml: "auto", mt: 8, width: { xs: "100%", sm: "auto" } }}
                            onClick={formik.handleSubmit}
                            type="submit"
                        >
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Box>
            {!isEditing && (
                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            mt: 8,
                            display: "block",
                            maxWidth: "80%",
                            mr: { xs: "auto", sm: "0" },
                            ml: "auto",
                            width: { xs: "100%", sm: "auto" },
                        }}
                        onClick={() => {
                            dispatch(userLogout());
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            )}
        </form>
    );
};
