import React from 'react'
import { Theme } from './context/ThemeContext'
import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux';
import store from './redux/store';

export default function SecondaryLayout({ children }) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={Theme}>
                {children}
            </ThemeProvider>
        </Provider>
    )
}
