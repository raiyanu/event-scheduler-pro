"use client";
import {
    Badge,
    Box,
    Button, IconButton, styled,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import MainLayout from "../PrimaryLayout";
import { useSelector } from "react-redux";
import {
    AccountCircle,
    Close, Edit, FileUploadSharp,
    GppMaybe, VerifiedUser
} from "@mui/icons-material";
import { useState } from "react";
import { useFormik } from "formik";
import { updateUserInfo, validateUserEmail } from "@/config/firebase";
import Image from "next/image";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function page() {
    return (
        <MainLayout>
            <Box className="max-h-full overflow-y-scroll p-2 pb-12 lg:p-3">
                <Typography
                    sx={{
                        color: "primary.main",
                    }}
                    variant="h4"
                >
                    Settings
                </Typography>
                <UserSettings />
            </Box>
        </MainLayout>
    );
}

const UserSettings = () => {
    const userInfo = useSelector((state) => state.AUTH.user);
    const formik = useFormik(userSettingActionFormConfig(userInfo));
    const isLogged = useSelector((state) => state.AUTH.loginStatus);
    const [isEditing, setIsEditing] = useState(false);
    console.log(userInfo)
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
    return (
        <>
            {!isLogged ? (<Typography sx={{
                color: "primary.main",
            }}
                variant="h6">Login to continue</Typography>) : (
                <Box className="mx-2 h-max lg:mx-8">
                    <Typography variant="subtitle1" color="textSecondary" className="my-4">
                        Account Information
                    </Typography>
                    <Box className="mt-8 flex w-full max-w-2xl items-start justify-between *:flex-grow-0">
                        <Box className="flex max-w-lg items-center">
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
                                    onChange={async (event) => {
                                        try {
                                            console.log(event.target.files)
                                            const file = event.target.files[0];

                                            const formData = new FormData();
                                            formData.append("image", file);

                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }}
                                />
                            </IconButton>

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
                            {data?.map((item, index) => {
                                return (
                                    <Box key={index}>
                                        {isEditing ? (
                                            <TextField
                                                variant="outlined"
                                                label={item.label}
                                                name={item.name}
                                                value={formik.values[item.name]}
                                                onChange={formik.handleChange}
                                            />
                                        ) : (
                                            <>
                                                <Box className="flex items-center">
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        {item.label}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h5" color="textPrimary" className="">
                                                    {item.displayValue}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                );
                            })}
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
            )}
        </>
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
