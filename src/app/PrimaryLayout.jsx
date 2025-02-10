"use client";
import { Suspense } from 'react';
import { Theme } from './context/ThemeContext';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import store from './redux/store';
import GlobalActionProvider from './GlobalActionProvider';
import TaskDetailPanelProvider from './context/TaskDetailPanelProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TaskCrudDrawerProvider } from './component/AddTask';
import DrawerAppBar from './component/AppBar';

export default function MainLayout({ children }) {
    return (
        <Suspense fallback={<></>}>
            <PublicLayout>
                <TaskCrudDrawerProvider>
                    <TaskDetailPanelProvider>
                        <DrawerAppBar>
                            {children}
                        </DrawerAppBar>
                    </TaskDetailPanelProvider>
                </TaskCrudDrawerProvider>
            </PublicLayout >
        </Suspense>
    )
}

export function PublicLayout({ children }) {
    return (
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <GlobalActionProvider>
                    <ThemeProvider theme={Theme} >
                        {children}
                    </ThemeProvider>
                </GlobalActionProvider>
            </LocalizationProvider>
        </Provider>
    )
}
