"use client";
import { useState, useEffect, Fragment, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    IconButton,
    ListItemButton,
    styled,
    Tab,
    Tabs,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/slice/taskSlice";
import { Refresh } from "@mui/icons-material";
import { TaskDetailPanelContext } from "../context/TaskDetailPanelProvider";


const FriendlyDate = (nanoseconds) => {
    const staticDate = new Date(nanoseconds / 1000000);
    const now = new Date();
    const diff = staticDate - now;
    const oneDay = 24 * 60 * 60 * 1000;
    if (diff < oneDay && staticDate.getDate() === now.getDate()) {
        return `Today at ${staticDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diff < 2 * oneDay && staticDate.getDate() === now.getDate() + 1) {
        return `Tomorrow at ${staticDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
        return `${staticDate.toLocaleDateString()} - ${staticDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
};

const CustomTabContainer = styled(Tabs)({
    borderBottom: "1px solid rgba(0, 0, 0, 0)",
    "& .MuiTabs-indicator": {
        backgroundColor: "transparent",
    },
});

const CustomListContainer = styled(List)({
    borderBottom: "1px solid rgba(0, 0, 0, 0)",
    "& .MuiTabs-indicator": {
        backgroundColor: "transparent",
    },
    maxHeight: "420px",
    overflowY: "scroll",
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

export default function TaskContainer() {
    const [value, setValue] = useState(1);
    const isLoading = useSelector((state) => state.TASK.taskLoading);
    const dispatch = useDispatch();
    const loadTask = () => {
        dispatch(fetchTasks());
    };
    return (
        <Box className="relative mt-8 grid grid-cols-1 gap-4 px-2 lg:px-0">
            <Backdrop
                sx={(theme) => ({
                    zIndex: theme.zIndex.drawer + 1,
                    color: "#fff",
                    backgroundColor: "white",
                    maxWidth: "100%",
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                })}
                open={isLoading === "loading"}
            >
                <CircularProgress sx={(theme) => ({ color: "orange" })} />
            </Backdrop>
            <Typography variant="h3" className="font-semibold">
                Your tasks
            </Typography>
            <Box
                sx={{
                    width: "100%",
                    overflowY: isLoading === "loading" ? "hidden" : "",
                    maxHeight: isLoading === "loading" ? "100px" : "",
                }}
                className="relative"
            >
                <Box className="sticky left-0 top-0 flex justify-between">
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
                        <CustomTab label="Yesterday" {...taskNavTabPropsGenerator(0)} />
                        <CustomTab label="Today" {...taskNavTabPropsGenerator(1)} />
                        <CustomTab label="Tomorrow" {...taskNavTabPropsGenerator(2)} />
                    </CustomTabContainer>

                    <IconButton
                        aria-label="RefreshTask"
                        color="primary"
                        sx={{
                            height: "26px",
                            marginBlock: "auto",
                            width: "fit-content",
                            maxWidth: "28px",
                            padding: 0,
                        }}
                        onClick={loadTask}
                    >
                        <Refresh />
                    </IconButton>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    Yesterday
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1} className="*:p-0">
                    <TaskList />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Tomorrow
                </CustomTabPanel>
            </Box>
        </Box>
    );
}

export function TaskList() {
    const tasks = useSelector((state) => state.TASK.tasks);

    const dispatch = useDispatch();
    useEffect(() => {
        loadTask();
    }, []);

    const loadTask = () => {
        dispatch(fetchTasks());
    };
    return (
        <CustomListContainer
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                minHeight: "120px",
                marginInline: "auto",
            }}
        >
            {tasks.map((task, index) => (
                <Fragment key={index}>
                    <MyListItem info={task} />
                    {index < tasks.length - 1 && (
                        <Divider variant="inset" component="li" />
                    )}
                </Fragment>
            ))}
        </CustomListContainer>
    );
}

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

export const MyListItem = ({ info }) => {
    const [date, setDate] = useState("");
    const { handleClickOpen } = useContext(TaskDetailPanelContext);
    useEffect(() => {
        setDate(FriendlyDate(info.startTime.nanoseconds));
    }, []);
    return (
        <ListItem alignItems="flex-start" className="p-0">
            <ListItemButton onClick={() => {
                handleClickOpen(info);
            }}>
                <ListItemAvatar>
                    {info.icon ? <Avatar>{info.icon}</Avatar> : <Avatar alt={info.Name} />}
                </ListItemAvatar>
                <ListItemText
                    primary={< Typography
                        component="span"
                        variant="subtitle1"
                        sx={{ color: "text.primary", display: "inline" }} className="font-bold"
                    >
                        {info.title}
                    </Typography>}
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: "text.primary", display: "inline" }}
                            >
                                {date}
                            </Typography>
                            {" — " + info.description}
                        </>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
};

function taskNavTabPropsGenerator(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
