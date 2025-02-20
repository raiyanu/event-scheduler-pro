"use client";
import {
    Badge,
    Box,
    Button,
    FormControl,
    FormLabel,
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

export default function page() {
    return (
        <MainLayout>
            <UserSettings />
        </MainLayout>
    );
}

export const UserSettings = (props) => {
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
                if (props.onDateChange) {
                    props.onDateChange();
                } else {
                    setIsEditing(false);
                }
            } else {
                console.error("User info update failed");
            }
        },
    });
    const isLogged = useSelector((state) => state.AUTH.loginStatus);
    const [isEditing, setIsEditing] = useState(props.editOpen);
    const dispatch = useDispatch();

    useEffect(() => {
        formik.setValues(userInfo);
    }, [userInfo]);
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
            className="mx-auto max-h-full max-w-[1100px] overflow-y-auto px-3 pb-24 max-sm:mx-auto md:px-6"
        >
            <Box className="flex max-w-[1000px] items-center justify-between gap-4">
                <Box>
                    <Typography
                        sx={{
                            color: "primary.main",
                            m: 0,
                            fontStyle: "italic",
                        }}
                        variant="h6"
                    >
                        Account
                    </Typography>
                    {
                        !props.editOpen && (
                            <Typography variant="h4" sx={{ my: 0 }} fontWeight={200} color="textSecondary">
                                Settings
                            </Typography>
                        )
                    }
                </Box>
                {
                    !isEditing &&
                    <IconButton
                        variant="text"
                        size="medium"
                        className="h-8"
                        color="primary"
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        {isEditing ? <Close /> : <Edit />}
                    </IconButton>
                }
            </Box>
            <Box className="mt-8 flex w-full items-start gap-8 px-4 max-lg:flex-col">
                <Tooltip title="Click to change" enterDelay={1000} leaveDelay={200}>
                    <IconButton
                        component="label"
                        role={undefined}
                        variant="text"
                        tabIndex={-1}
                        sx={{ p: 0, mx: "auto" }}
                    >
                        <Badge
                            badgeContent={<FileUploadSharp color="action" className={`opacity-80 hover:opacity-100 ${userInfo.photoURL ? "" : ""}`} />}
                            overlap="circular"
                            className="cursor-pointer bg-transparent"
                        >
                            {userInfo.photoURL ? (
                                <img referrerpolicy="no-referrer" src={userInfo.photoURL} crossOrigin="anonymous" className="rounded-full opacity-100 hover:opacity-80" />
                            ) : (
                                <AccountCircle color="disabled" sx={{ fontSize: 100 }} />
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
                            sx={{ p: 0 }}
                        />
                    </IconButton>
                </Tooltip>

                <Box
                    sx={{ p: 0, mx: "auto" }}
                    className="grid w-full flex-grow basis-full grid-cols-[auto_auto] gap-x-4 gap-y-4 max-sm:max-w-[300px] max-sm:grid-cols-[1fr] md:grid-cols-[1fr_4fr]" >
                    <UserTextField label={"USERNAME"} isEditing={isEditing} value={formik.values.username} onChange={formik.handleChange} name={"username"} user={userInfo} />
                    <UserTextField label={"FIRST NAME"} isEditing={isEditing} value={formik.values.firstName} onChange={formik.handleChange} name={"firstName"} user={userInfo} />
                    <UserTextField label={"LAST NAME"} isEditing={isEditing} value={formik.values.lastName} onChange={formik.handleChange} name={"lastName"} user={userInfo} />
                    <UserTextField label={"PHONE"} isEditing={isEditing} value={formik.values.phone} onChange={formik.handleChange} name={"phone"} user={userInfo} />
                    <Box className="contents">
                        <Typography variant="h6" color="textSecondary" sx={{
                            minWidth: "max-content", fontSize: "1.5rem", textAlign: {
                                md: "right",
                                display: "block"
                            }
                        }}>
                            Email
                        </Typography>
                        <Typography
                            variant="h5"
                            color="textDisabled"
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
                                        onClick={() => {
                                            validateUserEmail();
                                        }}
                                        size="small"
                                        sx={{
                                            ml: {
                                                sm: 0,
                                                lg: 2
                                            }
                                        }}
                                    >
                                        <GppMaybe color="warning" /> Verify
                                    </Button>
                                </Tooltip>
                            )}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {isEditing && (
                <Box
                    sx={{
                        mt: 8,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="text"
                        color="secondary"
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        onClick={
                            () => {
                                setIsEditing(false);
                                formik.setValues(userInfo);
                            }
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        onClick={formik.handleSubmit}
                        type="submit"
                    >
                        Save
                    </Button>
                </Box>
            )}
            {!isEditing && (
                <Box sx={{ mt: 8 }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
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
                    <Button
                        type="submit"
                        hidden
                    ></Button>
                </Box>
            )}

        </form>
    );
}


const UserTextField = (props) => {
    return (
        <FormControl className="contents">
            <Typography variant="h6" color="textSecondary" sx={{
                minWidth: "max-content", fontSize: "1.5rem", textAlign: {
                    md: "right",
                }
            }}>
                {props.label}
            </Typography>
            {
                props.isEditing ? (
                    <TextField
                        variant="standard"
                        name={props.name}
                        value={props.value}
                        onChange={props.onChange}
                        sx={{
                            "& input": {
                                fontSize: "1.5rem",
                                padding: "0",
                            },
                            maxWidth: "max-content",
                        }}
                    />
                ) : (
                    <Typography variant="h5" color="textPrimary" >
                        {props.user[props.name] ? props.user[props.name] : "--"}
                    </Typography>
                )
            }
        </FormControl>
    )
}

const UserSettingsOld = () => {
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
            className="block max-h-full overflow-y-auto px-3 pb-24 max-sm:mx-auto md:px-6"
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
                {
                    false ? <Tooltip title="Edit profile">
                        <IconButton
                            variant="text"
                            size="medium"
                            className="h-8"
                            color="primary"
                            onClick={() => {
                                setIsEditing(false);
                                formik.setValues(userInfo);
                            }}
                        >
                            {isEditing ? <Close /> : <Edit />}
                        </IconButton>
                    </Tooltip> : null
                }
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
                            badgeContent={<FileUploadSharp color="action" className={`${userInfo.photoURL ? "hidden" : ""}`} />}
                            overlap="circular"
                            className="cursor-pointer bg-transparent hover:opacity-80"
                        >
                            {userInfo.photoURL ? (
                                <Tooltip title="Click to Profile Picture" enterDelay={500} leaveDelay={200}>
                                    <img src={userInfo.photoURL} className="rounded-full" />
                                </Tooltip>
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
                                type="number"
                                variant="outlined"
                                label="Phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                className="button-less"
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
                            sx={{ ml: "auto", width: { xs: "100%", sm: "auto" } }}
                            onClick={formik.handleSubmit}
                            type="submit"
                        >
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Box>
            {!isEditing && (
                <Box sx={{ mt: 8 }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
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