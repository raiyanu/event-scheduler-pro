"use client";
import * as React from 'react';
import Button from '@mui/material/Button';
import SideBarProvider from "../component/SideBar";
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <div className="max-w-full overflow-x-hidden">
      <SideBarProvider>
        <Typography variant='overline'>
          hello there
        </Typography>
      </SideBarProvider>
    </div>
  );
}
