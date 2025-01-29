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
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <MainLayout>
      <Box className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[1fr_2px_1fr] lg:gap-2">
        <Box>
          <WelcomeMessage />
          <TaskContainer />
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "rgba(0,0,0,0.05)",
            marginTop: "3rem",
          }}
        />
        <MainHeroSection />
      </Box>
    </MainLayout>
  );
}

export const MainHeroSection = () => {
  return (
    <Box>
      <ProfileLineCard />
    </Box>
  );
};

export const WelcomeMessage = () => {
  const userInfo = useSelector(getUser);
  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
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

const CustomTabContainer = styled(Tabs)({
  borderBottom: "1px solid rgba(0, 0, 0, 0)",
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
  },
});

const CustomTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.85)",
  color: "text.secondary",
  opacity: 0.7,
  "&.Mui-selected": {
    color: "text.secondary",
    fontWeight: theme.typography.fontWeightMedium,
    opacity: 1,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff",
  },
}));

export const TaskContainer = () => {
  const [value, setValue] = useState(1);
  return (
    <Box className="mt-8 grid grid-cols-1 gap-4">
      <Typography variant="h3" className="font-semibold">
        Your tasks
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Box>
          <CustomTabContainer
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <CustomTab label="Yesterday" {...a11yProps(0)} />
            <CustomTab label="Today" {...a11yProps(1)} />
            <CustomTab label="Tomorrow" {...a11yProps(2)} />
          </CustomTabContainer>
        </Box>
        <CustomTabPanel value={value} index={0}>
          Yesterday
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Today
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Tomorrow
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
