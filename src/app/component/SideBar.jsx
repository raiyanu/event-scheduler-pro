"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useEffect, useMemo, useState } from "react";
import { CalendarMonth, Home, Task } from "@mui/icons-material";
import { useDispatch, useSelector, useStore } from "react-redux";
import { getUser, isLogged, logout } from "../redux/slice/userSlice";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import {
    Avatar, Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList
} from "@mui/material";
import {
    Account,
    AccountPopoverFooter,
    AccountPreview,
    SignOutButton,
} from "@toolpad/core";
import Link from "next/link";

export default function SideBarProvider(props) {
    const [isClient, setIsClient] = useState(false);

    const user = useSelector(getUser);
    const isLoggedUser = useSelector(isLogged);
    const userState = useStore((state) => state.AUTH.user);
    const router = useRouter();
    const [session, setSession] = useState({
        user: {
            name: "",
            email: "",
            image: "",
        },
    });
    const dispatch = useDispatch();
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isLoggedUser) {
            setSession({ user: { ...user, name: user.displayName } });
        } else {
            setSession(null);
        }
    }, [user, isLoggedUser]);

    const { window } = props;
    const demoWindow = window !== undefined ? window() : undefined;
    const navigate = (path) => router.push(path);

    const authentication = useMemo(() => {
        return {
            signIn: () => {
                navigate("/");
            },
            signOut: async () => {
                await auth.signOut();
                dispatch(logout());
                setSession(null);
            },
        };
    }, [session]);

    return (
        <NextAppProvider
            authentication={authentication}
            session={session}
            branding={{
                logo: <img src="/logo.svg" alt="Event Scheduler Pro" />,
                title: "ES-Pro",
                homeUrl: "/home",
            }}
            navigation={[
                {
                    segment: "home",
                    title: "Home",
                    icon: <Home />,
                },
                {
                    segment: "agenda",
                    title: "Agenda",
                    icon: <Task />,
                    pattern: "agenda",
                },
                {
                    segment: "calendar",
                    title: "Calendar",
                    icon: <CalendarMonth />,
                    pattern: "calendar",
                }
            ]}
            window={demoWindow}
        >
            <DashboardLayout
                slots={{
                    toolbarAccount: () => null,
                    sidebarFooter: SidebarFooterAccount,
                }}
                sidebarExpandedWidth={222}
                slotProps={{
                    popover: {
                        transformOrigin: { horizontal: "left", vertical: "bottom" },
                        anchorOrigin: { horizontal: "right", vertical: "bottom" },
                        disableAutoFocus: true,
                        slotProps: {
                            paper: {
                                elevation: 0,
                                sx: {
                                    overflow: "visible",
                                    filter: (theme) =>
                                        `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
                                    mt: 1,
                                    "&::before": {
                                        content: '""',
                                        display: "block",
                                        position: "absolute",
                                        bottom: 10,
                                        left: 0,
                                        width: 10,
                                        height: 10,
                                        bgcolor: "background.paper",
                                        transform: "translate(-50%, -50%) rotate(45deg)",
                                        zIndex: 0,
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        borderRadius: 1,
                        bgcolor: "background.paper",
                    }}
                    className="h-screen overflow-y-auto overflow-x-hidden rounded-none"
                >
                    {props.children}
                </Box>
            </DashboardLayout>
        </NextAppProvider>
    );
}

function AccountSidebar(props) {
    const { handleClick, open, mini } = props;
    return (
        <Stack direction="column" p={0}>
            <Divider />
            <AccountPreview
                variant={mini ? "condensed" : "expanded"}
                handleClick={handleClick}
                open={open}
            />
        </Stack>
    );
}

AccountSidebar.propTypes = {
    /**
     * The handler used when the preview is expanded
     */
    handleClick: PropTypes.func,
    mini: PropTypes.bool.isRequired,
    /**
     * The state of the Account popover
     * @default false
     */
    open: PropTypes.bool,
};

const accounts = [
    {
        id: 1,
        name: "Bharat Kashyap",
        email: "bharatkashyap@outlook.com",
        image: "https://avatars.githubusercontent.com/u/19550456",
        projects: [
            {
                id: 3,
                title: "Project X",
            },
        ],
    },
    {
        id: 2,
        name: "Bharat MUI",
        email: "bharat@mui.com",
        color: "#8B4513", // Brown color
        projects: [{ id: 4, title: "Project A" }],
    },
];
function AccountSidebarPreview(props) {
    const { handleClick, open, mini } = props;
    return (
        <Stack direction="column" p={0}>
            <Divider />
            <AccountPreview
                variant={mini ? "condensed" : "expanded"}
                handleClick={handleClick}
                open={open}
            />
        </Stack>
    );
}

AccountSidebarPreview.propTypes = {
    /**
     * The handler used when the preview is expanded
     */
    handleClick: PropTypes.func,
    mini: PropTypes.bool.isRequired,
    /**
     * The state of the Account popover
     * @default false
     */
    open: PropTypes.bool,
};

const createPreviewComponent = (mini) => {
    function PreviewComponent(props) {
        return <AccountSidebarPreview {...props} mini={mini} />;
    }
    return PreviewComponent;
};

function SidebarFooterAccount({ mini }) {
    const PreviewComponent = useMemo(() => createPreviewComponent(mini), [mini]);
    return (
        <Account
            slots={{
                preview: PreviewComponent,
                popoverContent: SidebarFooterAccountPopover,
            }}
            slotProps={{
                popover: {
                    transformOrigin: { horizontal: "left", vertical: "bottom" },
                    anchorOrigin: { horizontal: "right", vertical: "bottom" },
                    disableAutoFocus: true,
                    slotProps: {
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: (theme) =>
                                    `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
                                mt: 1,
                                "&::before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    bottom: 10,
                                    left: 0,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translate(-50%, -50%) rotate(45deg)",
                                    zIndex: 0,
                                },
                            },
                        },
                    },
                },
            }}
        />
    );
}

SidebarFooterAccount.propTypes = {
    mini: PropTypes.bool.isRequired,
};

function SidebarFooterAccountPopover() {
    return (
        <Stack direction="column" className="rouned-md border p-4">
            {/* <Typography variant="subtitle1" mx={2} mt={1}>
                Option
            </Typography> */}

            <Link href="/setting"><Button variant="text">Settings</Button></Link>
            <AccountPopoverFooter>
                <SignOutButton />
            </AccountPopoverFooter>
        </Stack>
    );
}

// TODO: UNUSED BOILERPLATE : REMOVE
function AccountList() {
    return (
        <MenuList>
            {accounts.map((account) => (
                <MenuItem
                    key={account.id}
                    component="button"
                    sx={{
                        justifyContent: "flex-start",
                        width: "100%",
                        columnGap: 2,
                    }}
                >
                    <ListItemIcon>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                fontSize: "0.95rem",
                                bgcolor: account.color,
                            }}
                            src={account.image ?? ""}
                            alt={account.name ?? ""}
                        >
                            {account.name[0]}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                        }}
                        primary={account.name}
                        secondary={account.email}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption" }}
                    />
                </MenuItem>
            ))}
        </MenuList>
    );
}

{
    /* <PageContent
    pathname={router.pathname}
    navigate={router.navigate}
/> */
}

function PageContent({ pathname, navigate }) {
    return (
        <Box
            sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Typography>Dashboard content for {pathname}</Typography>
            {pathname.startsWith("/orders") ? (
                <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                    <Button
                        onClick={() => {
                            navigate("/orders/1");
                        }}
                    >
                        Order 1
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/orders/2");
                        }}
                    >
                        Order 2
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/orders/3");
                        }}
                    >
                        Order 3
                    </Button>
                </Stack>
            ) : null}
        </Box>
    );
}
