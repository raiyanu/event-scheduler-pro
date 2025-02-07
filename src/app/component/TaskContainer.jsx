"use client";
import { useState, useEffect, Fragment, useMemo } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
    Alert, Backdrop,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fade,
    FormControl, IconButton,
    InputLabel,
    ListItemButton, MenuItem,
    Modal,
    Paper, Select,
    styled, Tooltip,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteTasks, fetchTasks, updateTask } from "../redux/slice/taskSlice";
import { Close, Delete, Edit, HourglassBottom, PushPin, Tag, WorkspacePremium } from "@mui/icons-material";
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { TaskForm } from "./AddTask";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { ClockIcon } from "@mui/x-date-pickers";
import Image from "next/image";

const FriendlyDate = (input) => {
    const date = new Date(input.seconds);
    if (isToday(date)) {
        return `Today ${format(date, 'p')}`;
    } else if (isTomorrow(date)) {
        return `Tomorrow ${format(date, 'p')}`;
    } else if (isYesterday(date)) {
        return `Yesterday ${format(date, 'p')}`;
    } else {
        return format(date, 'd MMM p');
    }
};


const CustomListContainer = styled(List)({
    borderBottom: "1px solid rgba(0, 0, 0, 0)",
    "& .MuiTabs-indicator": {
        backgroundColor: "transparent",
    },
    maxHeight: "420px",
    overflowY: "scroll",
});


export default function TaskContainer() {
    const isLoading = useSelector((state) => state.TASK.taskLoading);
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
                <TaskList />
            </Box>
        </Box>
    );
}

export function TaskList() {
    const tasks = useSelector((state) => state.TASK.tasks);
    const sortedTasks = useMemo(() => {
        try {
            return sortTasksByCreatedAt(tasks);
        } catch (error) {
            console.log(error);
            return []
        }
    }, [tasks]);
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
            {sortedTasks.map((task, index) => (
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


export const MyListItem = ({ info }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleClose = () => {
        setOpen(false);
    };


    const [openEditModal, setOpenEditModal] = useState(false);
    const handleEditModalOpen = () => setOpenEditModal(true);
    const handleEditModalClose = () => setOpenEditModal(false);

    const [DeleteActionModal, setDeleteActionModal] = useState(false);
    const handleDeleteActionModalOpen = () => setDeleteActionModal(true);
    const handleDeleteActionModalClose = () => setDeleteActionModal(false);

    const displatch = useDispatch();
    const [markdown, setMarkdown] = useState("");
    const [date, setDate] = useState("");
    const fullScreen = useMediaQuery(theme.breakpoints.up("300px"));

    useEffect(() => {
        setDate(FriendlyDate(info.startTime));
    }, []);

    return (
        <>
            <ListItem alignItems="flex-start" className="p-0">
                <ListItemButton onClick={() => {
                    setOpen(true)
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
            <Dialog
                fullScreen={fullScreen}
                maxWidth="lg"
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                sx={{
                    ".MuiDialog-paper": {
                        width: "100%",
                        minWidth: "360px",
                        maxWidth: "600px",
                    },
                }}
            >
                <Box>
                    <DialogTitle
                        id="responsive-dialog-title"
                        className="mr-[1.5rem] flex items-center gap-2 max-md:items-start"
                    >
                        <span className="text-3xl max-md:mt-1 max-md:text-xl">{info?.icon ? info.icon : "--"}</span>
                        <span className="text-xl max-md:text-base">{info?.title ? info.title : "--"}</span>
                    </DialogTitle>
                    <IconButton
                        autoFocus
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <Close />
                    </IconButton>
                </Box>
                <Divider className="mx-[2rem]" />
                <DialogContent className="px-6 py-0 *:mt-3">
                    <Box className="flex max-w-full items-center gap-2">
                        <ClockIcon />
                        <Box className="flex flex-shrink-0 flex-wrap max-md:flex-col">
                            <Typography>
                                {info?.startTime
                                    ? formatDate(new Date(info.startTime.seconds * 1000))
                                    : "--"}
                            </Typography>
                            <Divider
                                className="max-md:hidden"
                                orientation="vertical"
                                sx={{ height: "1.5rem", marginInline: "10px" }}
                            />
                            <Typography>
                                {info?.endTime
                                    ? formatDate(new Date(info.endTime.seconds * 1000))
                                    : "--"}
                            </Typography>
                        </Box>
                    </Box>
                    <DialogContentText className="p-0 *:mt-2" variant="body1">
                        {info?.description ? info.description : "--"}
                    </DialogContentText>
                    <Box className="grid grid-cols-2">
                        <Typography variant="">
                            <Tooltip title="Difficulty">
                                <WorkspacePremium />{" "}
                                {info?.difficulty ? info.difficulty : "--"}
                            </Tooltip>
                        </Typography>
                        <Typography variant="">
                            <Tooltip title="Importance">
                                <Image src={"/Ribbon.svg"} width={18} height={18} className="inline-block h-5 w-5" /> {info?.importance ? info.importance : "--"}
                            </Tooltip>
                        </Typography>
                    </Box>
                    <Box className="grid grid-cols-2">
                        <Typography variant="">
                            <Tooltip title="Priority">
                                <PushPin /> {info?.priority ? info.priority : "--"}
                            </Tooltip>
                        </Typography>
                        <Typography>
                            <Tooltip title="Status">
                                <HourglassBottom />{" "}
                                {info?.status ? friendlyStatus(info.status) : "--"}
                            </Tooltip>
                        </Typography>
                    </Box>
                    {/* <Box>
                        <Typography variant="button">
                            Created At: 
                            {info?.createdAt ? new Date(info.createdAt.seconds * 1000).toLocaleString() : "--"}
                        </Typography>
                    </Box> */}
                    <Box className="flex gap-2">
                        <Tag />
                        <Box className="flex flex-wrap gap-2">
                            {info.tags &&
                                info.tags.length >= 0 &&
                                info.tags.map((tag, index) => (
                                    <Chip
                                        label={tag}
                                        key={index.toString() + "-myTaskElementTags"}
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                    />
                                ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions className="mt-4 justify-between">
                    <Box className="flex justify-between">
                        <IconButton
                            onClick={() => {
                                handleClose();
                                handleDeleteActionModalOpen();
                            }}
                            variant="contained"
                            color="warning"
                            autoFocus
                        >
                            <Delete />
                        </IconButton>
                        <IconButton
                            onClick={handleEditModalOpen}
                            variant="contained"
                            color="warning"
                            autoFocus
                        >
                            <Edit />
                        </IconButton>
                    </Box>
                    <Box className="flex gap-2 *:flex-shrink-0 *:flex-grow-0">
                        <Box className="flex flex-col gap-1 sm:flex-row">
                            <FormControl sx={{ minWidth: 80 }} fullWidth>
                                <InputLabel
                                    id="demo-simple-select-label"
                                    sx={{
                                        "&:not(.Mui-focused):not(.MuiInputLabel-shrink)": {
                                            transform: "translate(15px, 10px) scale(1)",
                                        },
                                    }}
                                >
                                    Mark
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Mark"
                                    value={markdown}
                                    onChange={(e) => setMarkdown(e.target.value)}
                                    size="small"
                                    className="p-0"
                                >
                                    <MenuItem value={"to-start"}>To-start</MenuItem>
                                    <MenuItem value={"progress"}>Progress</MenuItem>
                                    <MenuItem value={"done"}>Done</MenuItem>
                                </Select>
                            </FormControl>
                            {markdown !== "" && (
                                <Button
                                    className="h-10"
                                    variant="outlined"
                                    onClick={async () => {
                                        await displatch(
                                            updateTask({ id: info.id, task: { status: markdown } })
                                        );
                                        await handleClose();
                                    }}
                                >
                                    Updated
                                </Button>
                            )}
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog >
            <TaskDeleteModal DeleteActionModal={DeleteActionModal} handleDeleteActionModalClose={handleDeleteActionModalClose} taskId={info.id} handleClose={handleClose} />
            <Modal
                anchor={"bottom"}
                open={openEditModal}
                onClose={handleEditModalClose}
                onOpen={handleEditModalOpen}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& .MuiDrawer-paper": {
                        width: "100%",
                        maxWidth: "700px",
                        minWidth: "300px",
                        marginInline: "auto",
                    },
                    "& .MuiDrawer-modal": {
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    zIndex: (theme) => theme.zIndex.modal,
                }}
            >
                <Paper
                    sx={{
                        width: "100%",
                        height: "80vh",
                        p: "1rem",
                        marginInline: "auto",
                        maxWidth: "700px",
                    }}
                >
                    <UpdateTask task={info} openEditModal={openEditModal} handleEditModalOpen={handleEditModalOpen} handleEditModalClose={handleEditModalClose} />
                </Paper>
            </Modal>
        </>
    );
};

export const TaskDeleteModal = ({ DeleteActionModal, handleDeleteActionModalClose, taskId, handleClose }) => {
    const displatch = useDispatch();
    return (<Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={DeleteActionModal}
        onClose={handleDeleteActionModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
            backdrop: {
                timeout: 500,
            },
        }}
        className="flex items-center justify-center"
    >
        <Fade in={DeleteActionModal}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: 400,
                    width: "100%",
                    // bgcolor: 'background.paper',
                    // boxShadow: 24,
                }}
            >
                <Alert
                    color="error"
                    sx={{
                        height: "100%",
                        p: 2,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Are you sure you want to delete this task?
                    </Typography>
                    <Box
                        direction="row"
                        spacing={2}
                        sx={{
                            mt: 2,
                            display: "flex",
                            flexDirection: "row-reverse",
                            gap: "1rem",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                                await displatch(deleteTasks(taskId));
                                handleDeleteActionModalClose();
                                handleClose();
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                handleDeleteActionModalClose();
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Alert>
            </Box>
        </Fade>
    </Modal>)
}


export const UpdateTask = ({ task, handleEditModalClose }) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            title: task?.title ? task?.title : "",
            description: task?.description ? task?.description : "",
            priority: task?.priority ? task?.priority : "",
            startTime: task?.startTime?.seconds
                ? dayjs(task?.startTime.seconds * 1000)
                : null,
            endTime: task?.endTime?.seconds
                ? dayjs(task?.endTime.seconds * 1000)
                : null,
            importance: task?.importance ? task?.importance : "",
            icon: task?.icon ? task?.icon : "😉",
            difficulty: task?.difficulty ? task?.difficulty : "",
            createdAt: task?.createdAt ? task?.createdAt : null,
            status: task?.status ? task?.status : "",
            tags: task?.tags ? task?.tags : [],
        },
        onSubmit: async (values) => {
            console.log("values before mod: ", values);
            let startTime = values.startTime;
            values.startTime = {
                seconds: Math.floor(startTime / 1000),
                nanoseconds: (startTime % 1000) * 1000000,
            };

            values.createdAt = {
                seconds: Math.floor(new Date() / 1000),
                nanoseconds: new Date() * 1000000,
            };

            let endTime = values.endTime;
            values.endTime = {
                seconds: Math.floor(endTime / 1000),
                nanoseconds: (endTime % 1000) * 1000000,
            };
            values.id = task.id;
            console.log("values after mod: ", values);
            await dispatch(updateTask({ id: task.id, task: values }));
            await dispatch(fetchTasks());
            await handleEditModalClose();
            formik.resetForm();
        },
    });

    useEffect(() => {
        (async () => {
            await formik.resetForm();
            await formik.setValues({
                title: task?.title ? task?.title : "",
                description: task?.description ? task?.description : "",
                priority: task?.priority ? task?.priority : "",
                startTime: task?.startTime?.seconds
                    ? dayjs(task?.startTime.seconds * 1000)
                    : null,
                endTime: task?.endTime?.seconds
                    ? dayjs(task?.endTime.seconds * 1000)
                    : null,
                importance: task?.importance ? task?.importance : "",
                icon: task?.icon ? task?.icon : "😉",
                difficulty: task?.difficulty ? task?.difficulty : "",
                createdAt: task?.createdAt ? task?.createdAt : null,
                status: task?.status ? task?.status : "",
                tags: task?.tags ? task?.tags : [],
            });
            console.log("reset: ", formik.values, ": ", task?.title);
        })();
    }, [task]);

    return (
        <>
            <Box className="grid h-full grid-flow-row grid-rows-[50px_1fr_50px] gap-4">
                {/* Header */}
                <Box>
                    <Box className="flex w-full items-start justify-between">
                        <Typography variant="h5" className="p-3">
                            Update Task
                        </Typography>
                        <IconButton
                            onClick={handleEditModalClose}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                    <Divider />
                </Box>
                {/* Body */}
                <Box className="overflow-y-hidden">
                    <Box className="h-full overflow-y-scroll">
                        <TaskForm formik={formik} task={task} />
                    </Box>
                </Box>
                {/* Footer */}
                <Box>
                    <Divider />
                    <Box className="mt-4 flex items-center justify-end gap-3 *:flex-grow-0">
                        <Button
                            variant="text"
                            onClick={handleEditModalClose}
                        >
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={formik.handleSubmit}>
                            Update Task
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};


function sortTasksByCreatedAt(tasks) {
    const sortedTasks = [...tasks].sort((a, b) => {
        if (b.createdAt.seconds !== a.createdAt.seconds) {
            return b.createdAt.seconds - a.createdAt.seconds;
        }
        return b.createdAt.nanoseconds - a.createdAt.nanoseconds;
    });
    return sortedTasks;
}

export function formatDate(date) {
    const options = {
        year: "2-digit",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
    };
    return new Date(date)
        .toLocaleString("en-GB", { ...options, hour12: true })
        .replace(",", " ")
        .replace(" am", "AM")
        .replace(" pm", "PM");
}

export function friendlyStatus(status) {
    switch (status) {
        case "to-start":
            return "To start";
        case "progress":
            return "In progress";
        case "done":
            return "Done";
        default:
            return status;
    }
}



// Code for multiple task with tabbed
{/* <Box
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
</Box> */}


// function taskNavTabPropsGenerator(index) {
//     return {
//         id: `simple-tab-${index}`,
//         "aria-controls": `simple-tabpanel-${index}`,
//     };
// }

// const CustomTabContainer = styled(Tabs)({
//     borderBottom: "1px solid rgba(0, 0, 0, 0)",
//     "& .MuiTabs-indicator": {
//         backgroundColor: "transparent",
//     },
// });

// const CustomTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
//     color: "rgba(0, 0, 0, 0.85)",
//     color: "text.secondary",
//     opacity: 0.7,
//     "&.Mui-selected": {
//         color: "text.secondary",
//         fontWeight: theme.typography.fontWeightMedium,
//         opacity: 1,
//     },
//     "&.Mui-focusVisible": {
//         backgroundColor: "#d1eaff",
//     },
// }));

// function CustomTabPanel(props) {
//     const { children, value, index, ...other } = props;
//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//         </div>
//     );
// }


// const TaskForm = ({ formik }) => {
//     const [EmojiState, setEmojiState] = useState(false);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);
//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//         setAnchorEl(null);
//     };
//     return (
//         <Box className="grid gap-7 p-2">
//             <Box sx={{ display: "flex", alignItems: "flex-end" }}>
//                 <Box className="flex items-center">
//                     <IconButton
//                         id="basic-button"
//                         aria-controls={open ? "basic-menu" : undefined}
//                         aria-haspopup="true"
//                         aria-expanded={open ? "true" : undefined}
//                         className="aspect-square align-middle text-lg"
//                         onClick={(event) => {
//                             handleClick(event);
//                             setEmojiState(true);
//                         }}
//                     >
//                         {formik.values.icon}
//                     </IconButton>
//                     <Menu
//                         id="basic-menu"
//                         anchorEl={anchorEl}
//                         open={open}
//                         onClose={handleClose}
//                         MenuListProps={{
//                             "aria-labelledby": "basic-button",
//                         }}
//                     >
//                         <EmojiPicker
//                             open={EmojiState}
//                             onEmojiClick={(event) => {
//                                 console.log(event.emoji);
//                                 formik.setFieldValue("icon", event.emoji);
//                                 setEmojiState(false);
//                                 handleClose();
//                             }}
//                         />
//                     </Menu>
//                 </Box>
//                 <TextField
//                     fullWidth
//                     id="title"
//                     name="title"
//                     label="Title"
//                     variant="standard"
//                     value={formik.values.title}
//                     onChange={formik.handleChange}
//                     error={formik.touched.title && Boolean(formik.errors.title)}
//                     helperText={formik.touched.title && formik.errors.title}
//                 />
//             </Box>

//             <TextField
//                 fullWidth
//                 id="description"
//                 name="description"
//                 label="Description"
//                 variant="standard"
//                 value={formik.values.description}
//                 onChange={formik.handleChange}
//                 error={formik.touched.description && Boolean(formik.errors.description)}
//                 helperText={formik.touched.description && formik.errors.description}
//                 multiline
//                 maxRows={6}
//             />
//             <Box className="grid grid-cols-1 gap-3 lg:grid-cols-2">
//                 <FormControl variant="standard" sx={{}}>
//                     <InputLabel id="demo-simple-select-standard-label">
//                         Priority
//                     </InputLabel>
//                     <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={formik.values.priority}
//                         onChange={formik.handleChange}
//                         label="Priority"
//                         name="priority"
//                     >
//                         <MenuItem value={null}>none</MenuItem>
//                         <MenuItem value={"low"}>low</MenuItem>
//                         <MenuItem value={"casual"}>casual</MenuItem>
//                         <MenuItem value={"medium"}>medium</MenuItem>
//                         <MenuItem value={"high"}>high</MenuItem>
//                     </Select>
//                 </FormControl>
//                 <FormControl variant="standard" sx={{}}>
//                     <InputLabel id="demo-simple-select-standard-label">
//                         Importance
//                     </InputLabel>
//                     <Select
//                         id="importance"
//                         name="importance"
//                         variant="standard"
//                         label="Importance"
//                         value={formik.values.importance}
//                         onChange={formik.handleChange}
//                         error={
//                             formik.touched.importance && Boolean(formik.errors.importance)
//                         }
//                         helperText={formik.touched.importance && formik.errors.importance}
//                     >
//                         <MenuItem value={null}>none</MenuItem>
//                         <MenuItem value={"low"}>low</MenuItem>
//                         <MenuItem value={"medium"}>medium</MenuItem>
//                         <MenuItem value={"high"}>high</MenuItem>
//                         <MenuItem value={"critical"}>critical</MenuItem>
//                     </Select>
//                 </FormControl>
//             </Box>
//             <Box className="grid grid-cols-1 place-content-end content-end gap-3 lg:grid-cols-2"></Box>
//             <Box className="grid grid-cols-1 place-content-end content-end gap-3 lg:grid-cols-2">
//                 <DateTimePicker
//                     // disablePast T// ODO: enable this feature depending on the task status
//                     name="startTime"
//                     label="Start Time"
//                     format="DD/MM/YYYY-hh:MM"
//                     defaultValue={formik.values.startTime}
//                     onChange={(value) =>
//                         formik.setFieldValue("startTime", value.toDate(), true)
//                     }
//                     slotProps={{
//                         textField: {
//                             variant: "outlined",
//                             error:
//                                 formik.touched.startTime && Boolean(formik.errors.startTime),
//                             helperText: formik.touched.startTime && formik.errors.startTime,
//                         },
//                     }}
//                 />
//                 <DateTimePicker
//                     // disablePast // TODO: enable this feature depending on the task status
//                     label="End Time"
//                     name="endTime"
//                     format="DD/MM/YYYY-hh:MM"
//                     defaultValue={formik.values.endTime}
//                     onChange={(value) =>
//                         formik.setFieldValue("endTime", value.toDate(), true)
//                     }
//                     slotProps={{
//                         textField: {
//                             variant: "outlined",
//                             error: formik.touched.endTime && Boolean(formik.errors.endTime),
//                             helperText: formik.touched.endTime && formik.errors.endTime,
//                         },
//                     }}
//                 />
//             </Box>
//             <Box className="grid grid-cols-1 place-content-end content-end gap-3 lg:grid-cols-2">
//                 <FormControl>
//                     <FormLabel id="demo-row-radio-buttons-group-label">
//                         Difficulty
//                     </FormLabel>
//                     <RadioGroup
//                         row
//                         id="difficulty"
//                         name="difficulty"
//                         variant="standard"
//                         label="Difficulty"
//                         aria-labelledby="demo-row-radio-buttons-group-label"
//                         value={formik.values.difficulty}
//                         onChange={formik.handleChange}
//                         error={
//                             formik.touched.difficulty && Boolean(formik.errors.difficulty)
//                         }
//                         helperText={formik.touched.difficulty && formik.errors.difficulty}
//                     >
//                         <FormControlLabel value="easy" control={<Radio />} label="Easy" />
//                         <FormControlLabel
//                             value="medium"
//                             control={<Radio />}
//                             label="Medium"
//                         />
//                         <FormControlLabel value="hard" control={<Radio />} label="Hard" />
//                     </RadioGroup>
//                 </FormControl>
//                 <FormControl>
//                     <FormLabel id="demo-row-radio-buttons-group-label">Status</FormLabel>
//                     <RadioGroup
//                         row
//                         id="status"
//                         variant="standard"
//                         name="status"
//                         label="Status"
//                         value={formik.values.status}
//                         onChange={formik.handleChange}
//                         error={formik.touched.status && Boolean(formik.errors.status)}
//                         helperText={formik.touched.status && formik.errors.status}
//                     >
//                         <FormControlLabel
//                             value="to-start"
//                             control={<Radio />}
//                             label="To Start"
//                         />
//                         <FormControlLabel
//                             value="progress"
//                             control={<Radio />}
//                             label="progress"
//                         />
//                         <FormControlLabel value="done" control={<Radio />} label="Done" />
//                     </RadioGroup>
//                 </FormControl>
//             </Box>

//             <Autocomplete
//                 multiple
//                 id="tags"
//                 options={tagIdeas}
//                 freeSolo
//                 value={formik.values.tags}
//                 onChange={(event, newValue) => {
//                     formik.setFieldValue("tags", newValue);
//                 }}
//                 renderTags={(value, getTagProps) =>
//                     value.map((option, index) => (
//                         <Chip
//                             variant="outlined"
//                             label={option}
//                             {...getTagProps({ index })}
//                             key={index + "-chips"}
//                         />
//                     ))
//                 }
//                 renderInput={(params) => (
//                     <TextField
//                         {...params}
//                         variant="standard"
//                         label="Tags"
//                         placeholder="Add tags"
//                         error={formik.touched.tags && Boolean(formik.errors.tags)}
//                         helperText={formik.touched.tags && formik.errors.tags}
//                     />
//                 )}
//             />
//         </Box>
//     );
// };