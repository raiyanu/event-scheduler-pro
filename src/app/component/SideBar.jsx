import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useEffect, useMemo, useState } from "react";
import { Home, Task } from "@mui/icons-material";
import { useSelector, useStore } from "react-redux";
import { getUser, isLogged } from "../redux/slice/userSlice";
import store from "../redux/store";
import { auth } from "@/lib/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SideBarProvider(props) {
    const { window } = props;
    const demoWindow = window !== undefined ? window() : undefined;
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

    useEffect(() => {
        if (isLoggedUser) {
            setSession({ user: { ...user, name: user.displayName } });
        } else {
            router.push("/");
        }
    }, [user, isLoggedUser]);

    const authentication = useMemo(() => {
        return {
            signIn: () => {
                router.push("/");
            },
            signOut: async () => {
                await auth.signOut();
                router.push("/");
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
            ]}
            window={demoWindow}
        >
            <DashboardLayout defaultSidebarCollapsed>
                <Box
                    sx={{
                        borderRadius: 1,
                        bgcolor: "background.paper",
                    }}
                    className="h-screen overflow-y-auto overflow-x-hidden rounded-none p-2"
                >
                    {props.children}
                </Box>
            </DashboardLayout>
        </NextAppProvider>
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
