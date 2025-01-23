"use client"
import React, { useState } from 'react'
import MyCalendar from '../component/MyCalendar'

export default function Calendar() {
    const [count, setCount] = useState(0)
    return (
        <div className='h-screen p-8'>
            <MyCalendar />
            <button className='btn' onClick={() => setCount(count + 1)}>{count}</button>
        </div>
    )
}
