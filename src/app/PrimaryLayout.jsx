import React, { useEffect } from 'react'
import { Theme } from './context/ThemeContext'
import { ThemeProvider, useColorScheme } from '@mui/material'
import SideBarProvider from './component/SideBar';
import { Provider, useDispatch, useStore } from 'react-redux';
import store from './redux/store';
import { onAuthStateChanged } from 'firebase/auth';

export default function PrimaryLayout({ children }) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={Theme}>
                <SideBarProvider>
                    {children}
                </SideBarProvider>
            </ThemeProvider>
        </Provider>
    )
}
