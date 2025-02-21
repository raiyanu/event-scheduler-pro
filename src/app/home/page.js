"use client";
import {
  Autocomplete,
  Avatar, Box, IconButton,
  InputAdornment, Skeleton, styled,
  TextField, Typography
} from "@mui/material";
import MainLayout from "../PrimaryLayout";
import { MoreVert, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getUser } from "../redux/slice/userSlice";
import TaskList from "../component/TaskContainer";
import useOnScrollShowScrollbar from "../hooks/useOnScrollShowScrollbar";

const CustomContainer = styled(Box)(({ theme, isscrolling }) => ({
  [theme.breakpoints.up("md")]: {
    maxHeight: "calc(100vh)",
    overflowY: "scroll",
    scrollbarWidth: isscrolling == 'true' ? "" : "none",
    scrollbarBaseColor: "red",
    "&::-webkit-scrollbar": {
      width: isscrolling ? "7px" : "0px",
    },
    transition: "scrollbar-width 0.3s ease-in-out ease-in-out",
  },
}));

export default function Home() {
  const [isscrolling, scrollContainerRef, handleScroll] = useOnScrollShowScrollbar(1500);
  return (
    <MainLayout>
      <CustomContainer onScroll={handleScroll} ref={scrollContainerRef} isscrolling={isscrolling ? 'true' : 'false'} className="max-h-full flex-col-reverse gap-6 overflow-y-scroll pb-24 max-md:px-3 sm:px-2 md:px-4 lg:grid lg:gap-4">
        <Box>
          <WelcomeMessage />
          <TaskList />
        </Box>
      </CustomContainer>
    </MainLayout>
  );
}

export const MainHeroSection = () => (
  <>
    <ProfileLineCard />
  </>
);

export const WelcomeMessage = () => {
  const userInfo = useSelector(getUser);
  const tasks = useSelector((state) => state.TASK.tasks);
  const taskCount = tasks.length;
  const userLoadingStatus = useSelector((state) => state.AUTH.authenticatingState);

  return (
    <Box className="space-y-2">
      <Typography variant="body1" color="primary" className="font-semibold">
        {userInfo.firstName ? `Hey ${userInfo.firstName}! 👋` :
          null}
      </Typography>
      <Typography className="text-xl font-bold" sx={{ color: "text.secondary" }}>
        {
          taskCount > 0 ? `You have ${taskCount} task${taskCount > 1 ? "s" : ""} waiting!` : userLoadingStatus === "loading" ? "Loading..." : ""
        }
      </Typography>
    </Box>
  );
};

export const ProfileLineCard = () => {
  const userInfo = useSelector(getUser);

  return (
    <Box className="my-4 flex items-center gap-4 rounded-xl p-4 shadow-md" bgcolor={"background.b8"}>
      <Avatar src={userInfo?.photoURL || ""} alt="Profile" className="h-16 w-16" />
      <Box className="flex-1">
        <Typography variant="h6">{userInfo?.displayName}</Typography>
        <Typography variant="body2" color="textSecondary">{userInfo?.email}</Typography>
      </Box>
      <Box className="flex gap-3">
        <IconButton>
          <MoreVert />
        </IconButton>
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