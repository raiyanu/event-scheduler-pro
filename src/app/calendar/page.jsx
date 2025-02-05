"use client"
import React, { useState } from 'react'
import MyCalendar from '../component/MyCalendar'
import MainLayout from '../PrimaryLayout'
import { Box, Typography } from '@mui/material'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

export default function Calendar() {
    return (
        <MainLayout>
            <Box className="h-full p-2 lg:p-3">
                {/* <ErrorBoundary errorComponent={<Typography>Error</Typography>} errorScripts={() => console.log("Errror occured")}> */}
                <MyCalendar />
                {/* </ErrorBoundary> */}
            </Box>
        </MainLayout>
    )
}
