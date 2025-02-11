"use client";
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputAdornment, Skeleton, styled,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import MainLayout from "../PrimaryLayout";
import {
  Email, Notifications, Search
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getUser } from "../redux/slice/userSlice";
import { useState } from "react";
import TaskList from "../component/TaskContainer";
import useOnScrollShowScrollbar from "../hooks/useOnScrollShowScrollbar";
import { AddTaskLineCard } from "../component/AddTask";

const CustomContainer = styled(Box)(({ theme, isscrolling }) => ({
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
  const [scrollContainerRef2, isscrolling2] = useOnScrollShowScrollbar(Box);
  return (
    <MainLayout>
      <Box className="flex max-h-full flex-col-reverse gap-6 overflow-y-scroll *:flex-shrink-0 max-lg:px-4 lg:grid lg:grid-cols-2 lg:gap-4">
        <CustomContainer ref={scrollContainerRef} isscrolling={isscrolling ? 'true' : undefined} className="relative py-4 lg:px-4">
          <WelcomeMessage />
          <TaskList />
        </CustomContainer>
        <CustomContainer ref={scrollContainerRef2} isscrolling={isscrolling2 ? 'true' : undefined} className="relative py-4 lg:px-4">
          <MainHeroSection />
        </CustomContainer>
      </Box>
    </MainLayout>
  );
}

export const MainHeroSection = () => (
  <>
    <ProfileLineCard />
    <AddTaskLineCard />
  </>
);

export const WelcomeMessage = () => {
  const userInfo = useSelector(getUser);
  const tasks = useSelector((state) => state.TASK.tasks);
  const taskCount = tasks.length;
  const userLoadingStatus = useSelector((state) => state.AUTH.authenticatingState);

  return (
    <Box className="space-y-2 max-sm:hidden">
      <Typography variant="h6" color="primary" className="font-semibold">
        {userInfo.displayName ? `Hey ${userInfo.displayName?.split(" ")?.[0]}! 👋` :
          <Skeleton variant="text" width={200} height={30} />}
      </Typography>
      <Typography className="text-3xl font-bold text-gray-200">
        {
          taskCount > 0 ? `You have ${taskCount} tasks waiting!` : userLoadingStatus === "loading" ? "Loading..." : ""
        }
      </Typography>
    </Box>
  );
};

export const ProfileLineCard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userInfo = useSelector(getUser);

  return (
    <Box className="my-4 flex items-center gap-4 rounded-xl p-4 shadow-md" bgcolor={"background.b8"}>
      <Avatar src={userInfo?.photoURL || ""} alt="Profile" className="h-16 w-16" />
      <Box className="flex-1">
        <Typography variant="h6">{userInfo?.displayName}</Typography>
        <Typography variant="body2" color="textSecondary">{userInfo?.email}</Typography>
      </Box>
      <Box className="flex gap-3">
        <Tooltip title="Notifications">
          <IconButton>
            <Badge variant="dot" color="primary">
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Messages">
          <IconButton>
            <Email />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export function SearchBar() {
  return (
    <Box className="relative mt-4 w-full max-w-md">
      <Autocomplete
        freeSolo
        options={["Option 1", "Option 2"]}
        renderInput={(params) => (
          <TextField {...params} placeholder="Search" InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }} />
        )}
      />
    </Box>
  );
}

const CustomDivider = () => <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mt: 3 }} />;