"use client";
import Button from "@mui/material/Button";
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MainLayout from "../PrimaryLayout";
import {
  AccountCircle,
  Email,
  Logout,
  Notifications,
  Person,
  PersonAdd,
  Search,
  Settings,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getUser } from "../redux/slice/userSlice";
import { useEffect, useRef, useState } from "react";
import TaskList from "../component/TaskContainer";
import useOnScrollShowScrollbar from "../hooks/useOnScrollShowScrollbar";
import { AddTaskLineCard } from "../component/AddTask";


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
      <Box className="flex max-h-full flex-col-reverse gap-8 overflow-y-scroll lg:grid lg:grid-cols-[1fr_1fr] lg:gap-2">
        <CustomContainer ref={scrollContainerRef} isscrolling={isscrolling ? true : undefined} className="relative py-3 lg:px-3">
          <WelcomeMessage />
          <TaskList />
        </CustomContainer>
        <CustomContainer ref={scrollContainerRef} isscrolling={isscrolling ? true : undefined} className="relative py-3 lg:px-3">
          <MainHeroSection />
        </CustomContainer>
      </Box>
    </MainLayout>
  );
}

export const MainHeroSection = () => {
  return (
    <>
      <ProfileLineCard />
      <AddTaskLineCard />
    </>
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const userInfo = useSelector(getUser);
  return (
    <>
      <Box className="my-4 flex items-center gap-2 rounded-xl px-4 py-2">
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
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >

                  <Notifications />
                </IconButton>
              </Tooltip>
            </Badge>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >

                <Email />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
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