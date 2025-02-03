"use client";
import Button from "@mui/material/Button";
import {
  Autocomplete,
  Badge,
  Box,
  Divider,
  InputAdornment,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import MainLayout from "../PrimaryLayout";
import {
  AccountCircle,
  Email,
  Notifications,
  Person,
  Search,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getUser } from "../redux/slice/userSlice";
import { useEffect, useRef, useState } from "react";
import TaskList from "../component/TaskContainer";
import useOnScrollShowScrollbar from "../hooks/useOnScrollShowScrollbar";


export const CustomContainer = styled(Box)(({ theme, isscrolling }) => ({
  [theme.breakpoints.up("md")]: {
    maxHeight: "calc(100vh - 5rem)",
    overflowY: "scroll",
    scrollbarWidth: isscrolling ? "" : "none",
    scrollbarBaseColor: "red",
    "&::-webkit-scrollbar": {
      width: isscrolling ? "7px" : "0px",
    },
    transition: "scrollbar-width 0.3s ease-in-out ease-in-out",
  },
}));


export default function Home() {
  const [scrollContainerRef, isscrolling] = useOnScrollShowScrollbar(Box);
  return (
    <MainLayout>
      <Box className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-2">
        <CustomContainer ref={scrollContainerRef} isscrolling={isscrolling} className="relative py-3 lg:px-3">
          <WelcomeMessage />
          <TaskList />
        </CustomContainer>
        <CustomContainer ref={scrollContainerRef} isscrolling={isscrolling} className="relative py-3 lg:px-3">
          <MainHeroSection />
        </CustomContainer>
      </Box>
    </MainLayout>
  );
}

export const MainHeroSection = () => {
  return (
    <ProfileLineCard />
  );
};

export const WelcomeMessage = () => {
  const userInfo = useSelector(getUser);
  return (
    <Box className="max-lg:hidden">
      <Typography
        variant="h5"
        color="textSecondary"
        className="max-w-sm font-light"
      >
        Hello {userInfo.displayName?.split(" ")[0]} !
      </Typography>
      <Typography className="max-w-md text-5xl font-normal">
        You've got <br /> 8 tasks today
      </Typography>
    </Box>
  );
};

export const ProfileLineCard = () => {
  const userInfo = useSelector(getUser);
  return (
    <>
      <Box
        sx={{}}
        className="my-4 flex items-center gap-2 rounded-xl px-4 py-2"
      >
        <Box className="flex h-16 w-16 items-center gap-4 rounded-full p-0">
          {userInfo?.photoURL ? (
            <img
              src={userInfo.photoURL}
              alt="profile"
              className="h-full w-full rounded-full"
            />
          ) : (
            <AccountCircle sx={{
              fill: "var(--mui-palette-Avatar-defaultBg)",
            }} className="h-full w-full" />
          )}
        </Box>
        <Box className="flex w-full max-w-lg items-center justify-between">
          <Box>
            <Typography variant="h6" className="-mb-1">
              {userInfo?.displayName && userInfo.displayName} <br />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {userInfo?.email && userInfo.email}
            </Typography>
          </Box>
          <Box className="flex gap-4 *:cursor-pointer lg:gap-7">
            <Badge variant="dot" overlap="circular" color="primary">
              <Notifications />
            </Badge>
            <Email />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export function SearchBar() {
  return (
    <Box className="group relative mt-4 w-full max-w-md place-content-center items-center gap-8 rounded-xl px-2 *:!border-none *:!border-transparent">
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        className="border-none"
        options={[{ label: "Option 1" }, { label: "Option 2" }].map(
          (option) => option.label
        )}
        node={true}
        renderInput={(params) => (
          <TextField
            className="*:border-none"
            {...params}
            onSubmit={(e) => {
              console.log(e);
            }}
            placeholder="Search"
          />
        )}
      />
      <Search className="absolute bottom-1/2 right-8 -z-[1] h-full translate-x-1/2 translate-y-1/2 group-target:opacity-0 group-hover:opacity-0 group-focus-visible:opacity-0 group-active:opacity-0" />
    </Box>
  );
}


const CustomDivider = () => {
  return <Divider
    orientation="vertical"
    flexItem
    sx={{
      borderColor: "rgba(0,0,0,0.02)",
      marginTop: "3rem",
    }}
  />
}