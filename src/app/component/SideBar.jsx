import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NextAppProvider } from '@toolpad/core/nextjs';
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useMemo, useState } from "react";
import { Home } from "@mui/icons-material";
import { ThemeSwitcher } from "../context/ThemeContext";
import Theme from '../context/ThemeContext'




export default function SideBarProvider(props) {
    const { window } = props;
    const demoWindow = window !== undefined ? window() : undefined;
    const [session, setSession] = useState({
        user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });
    const authentication = useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
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
                title: 'Event Scheduler Pro',
                homeUrl: '/toolpad/core/introduction',
            }}
            navigation={[
                {
                    segment: "home",
                    title: "Home",
                    icon: <Home />,
                },
                {
                    segment: "orders",
                    title: "Orders",
                    icon: <ShoppingCartIcon />,
                    pattern: "orders{/:orderId}*",
                },
            ]}
            theme={Theme}
            window={demoWindow}
        >
            <DashboardLayout theme={Theme} defaultSidebarCollapsed>
                <Box sx={{
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    color: "black"
                }} className="overflow-y-auto overflow-x-hidden p-2" theme={Theme}>
                    {props.children}
                </Box>
            </DashboardLayout>
        </NextAppProvider>
    );
}



{/* <PageContent
    pathname={router.pathname}
    navigate={router.navigate}
/> */}

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
            <Typography>
                Dashboard content for {pathname}
            </Typography>
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