import React, { useEffect } from 'react'
import { Theme } from './context/ThemeContext'
import { ThemeProvider, useColorScheme } from '@mui/material'
import SideBarProvider from './component/SideBar';
import { Provider, useDispatch, useStore } from 'react-redux';
import store from './redux/store';
import { onAuthStateChanged } from 'firebase/auth';
import GlobalActionProvider from './GlobalActionProvider';

export default function MainLayout({ children }) {
    return (
        <PublicLayout>
            <SideBarProvider>
                {children}
            </SideBarProvider>
        </PublicLayout >
    )
}

export function PublicLayout({ children }) {
    return (
        <Provider store={store}>
            <GlobalActionProvider>
                <ThemeProvider theme={Theme}>
                    {children}
                </ThemeProvider>
            </GlobalActionProvider>
        </Provider>
    )
}
