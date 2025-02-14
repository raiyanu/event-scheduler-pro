"use client";
import { Suspense, useEffect, useState } from 'react';
import { MyThemeProvider, Theme } from './context/ThemeContext';
import { Box, Button, CircularProgress, ThemeProvider, Typography } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import GlobalActionProvider from './GlobalActionProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TaskCrudDrawerProvider } from './component/AddTask';
import DrawerAppBar from './component/AppBar';
import Link from 'next/link';

export default function MainLayout({ children }) {
    return (
        <PublicLayout>
            <TaskCrudDrawerProvider>
                <DrawerAppBar>
                    <Suspense fallback={<LoadingFallback />}>
                        <AuthenticationFrame>
                            {children}
                        </AuthenticationFrame>
                    </Suspense>
                </DrawerAppBar>
            </TaskCrudDrawerProvider>
        </PublicLayout >
    )
}

export function PublicLayout({ children }) {
    return (
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <GlobalActionProvider>
                    <MyThemeProvider theme={Theme} >
                        {children}
                    </MyThemeProvider>
                </GlobalActionProvider>
            </LocalizationProvider>
        </Provider>
    )
}


export function AuthenticationFrame({ children }) {
    const loginStatus = useSelector((state) => state.AUTH.loginStatus);
    const authenticatingState = useSelector((state) => state.AUTH.authenticatingState);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <LoadingFallback />;
    }

    if (!(authenticatingState !== 'to_initiate')) {
        return (
            <>
                <Box sx={{ height: "100%", maxHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <CircularProgress color="secondary" />
                </Box>
            </>
        )
    }
    if (!loginStatus) {
        return (<Box sx={{ height: "100%", maxHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }} >
            <Typography variant="h6" component="div" >
                Please login to continue
            </Typography>
            <Link href="/" passHref>
                <Button variant='contained' color="inherit">Login</Button>
            </Link>
        </Box >)
    }

    return (<>{children}</>)
}

function LoadingFallback() {
    return (
        <Box sx={{ height: "100%", maxHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }} >
            <CircularProgress color="secondary" />
        </Box>
    );
}