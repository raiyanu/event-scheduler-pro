"use client"
import { TaskCrudDrawerProvider } from '../component/AddTask'
import MyCalendar from '../component/MyCalendar'
import MainLayout from '../PrimaryLayout'
import { Box } from '@mui/material'

export default function Calendar() {
    return (
        <MainLayout>
            <Box className="h-[85vh] max-h-full min-h-[400px] overflow-y-scroll p-2 lg:p-3">
                <TaskCrudDrawerProvider>
                    <MyCalendar />
                </TaskCrudDrawerProvider>
            </Box>
        </MainLayout>
    )
}
