import React from 'react'
import { Theme } from './context/ThemeContext'
import { ThemeProvider, useColorScheme } from '@mui/material'
import SideBarProvider from './component/SideBar';

export default function PrimaryLayout({ children }) {
    return (
        <ThemeProvider theme={Theme}>
            <SideBarProvider>
                {children}
            </SideBarProvider>
        </ThemeProvider>
    )
}
