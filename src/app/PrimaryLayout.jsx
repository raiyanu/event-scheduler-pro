"use client"
import React, { Suspense, useEffect } from 'react'
import { Theme } from './context/ThemeContext'
import { ThemeProvider, useColorScheme } from '@mui/material'
import SideBarProvider from './component/SideBar';
import { Provider, useDispatch, useStore } from 'react-redux';
import store from './redux/store';
import { onAuthStateChanged } from 'firebase/auth';
import GlobalActionProvider from './GlobalActionProvider';
import TaskDetailPanelProvider from './context/TaskDetailPanelProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TaskCrudDrawerProvider } from './component/AddTask';

export default function MainLayout({ children }) {
    return (
        <Suspense fallback={<></>}>
            <PublicLayout>
                <TaskCrudDrawerProvider>
                    <TaskDetailPanelProvider>
                        <SideBarProvider>
                            {children}
                        </SideBarProvider>
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
