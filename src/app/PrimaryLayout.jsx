"use client";
import { Suspense } from 'react';
import { MyThemeProvider, Theme } from './context/ThemeContext';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import store from './redux/store';
import GlobalActionProvider from './GlobalActionProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TaskCrudDrawerProvider } from './component/AddTask';
import DrawerAppBar from './component/AppBar';

export default function MainLayout({ children }) {
    return (
        <PublicLayout>
            <TaskCrudDrawerProvider>
                <DrawerAppBar>
                    {children}
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
