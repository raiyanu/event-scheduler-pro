"use client";
import {
    Add, Close
} from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import { createContext, memo, useContext, useEffect, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import EmojiPicker from "emoji-picker-react";
import {
    DateTimePicker
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { addTasks } from "../redux/slice/taskSlice";

export function AddTaskLineCard() {
    const [date, setDate] = useState(null);
    useEffect(() => {
        setDate(new Date());
        const intervalId = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);
    return (
        <Box>
            <Box className="flex flex-wrap items-center justify-between rounded-lg p-3 shadow-md">
                <Box>
                    <Typography variant="body1">{date?.toDateString()}</Typography>
                    <Typography variant="h6">{date?.toLocaleTimeString()}</Typography>
                </Box>
                <Box>
                    <AddTaskButton />
                </Box>
            </Box>
        </Box>
    );
}

const AddTaskContainer = memo(function AddTaskContainer() {
    return <SwipeableDrawerContainer />;
});


export const TaskCrudDrawerContext = createContext(null);

export const TaskCrudDrawerProvider = ({ children }) => {
    const [drawerState, setDrawerState] = useState(false);
    const [task, setTask] = useState({});
    const toggleDrawer = (open, event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setDrawerState(open);
    };


    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            priority: "",
            startTime: dayjs(),
            endTime: dayjs(),
            importance: "",
            icon: "😉",
            difficulty: "",
            createdAt: null,
            status: "",
            tags: [],
        },
        onSubmit: async (values) => {
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
            await dispatch(addTasks(values));
            formik.resetForm();
            toggleDrawer(false)();
        },
    });

    const addTaskWithPreTime = async (payload) => {
        console.log("Payload: ", payload);
        await formik.setFieldValue("startTime", dayjs(new Date(payload.startTime)));
        await formik.setFieldValue("endTime", dayjs(new Date(payload.endTime))); // progress :TODO
        console.log("After setFieldValue, formik.values: ", formik.values);
    };

    return (
        <>
            <TaskCrudDrawerContext.Provider
                value={{
                    task,
                    toggleDrawer,
                    drawerState,
                    setTask,
                    addTaskWithPreTime
                }}
            >
                {children}

                <SwipeableDrawer
                    anchor={"bottom"}
                    open={drawerState}
                    onClose={(event) => {
                        toggleDrawer(false, event);
                    }}
                    onOpen={(event) => {
                        toggleDrawer(true, event);
                    }}
                    sx={{
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
                        zIndex: (theme) => theme.zIndex.drawer + 1,
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

                        <>
                            <Box className="grid h-full grid-flow-row grid-rows-[50px_1fr_50px] gap-4">
                                {/* Header */}
                                <Box>
                                    <Box className="flex w-full items-start justify-between">
                                        <Typography variant="h5" className="p-3">
                                            Add Task
                                        </Typography>
                                        <IconButton
                                            onClick={(event) => {
                                                toggleDrawer(false, event);
                                            }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Box>
                                    <Divider />
                                </Box>
                                {/* Body */}
                                <Box className="overflow-y-hidden">
                                    <Box className="h-full overflow-y-scroll">
                                        <TaskForm formik={formik} />
                                    </Box>
                                </Box>
                                {/* Footer */}
                                <Box>
                                    <Divider />
                                    <Box className="mt-4 flex items-center justify-end gap-3 *:flex-grow-0">
                                        <Button
                                            variant="text"
                                            onClick={(event) => {
                                                toggleDrawer(false, event);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button variant="contained" onClick={formik.handleSubmit}>
                                            Add Task
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    </Paper>
                </SwipeableDrawer>
            </TaskCrudDrawerContext.Provider>
        </>
    );
};

export { AddTaskContainer };

export const AddTaskButton = () => {
    const { toggleDrawer, setTask } = useContext(TaskCrudDrawerContext);
    return (
        <Button
            onClick={(event) => {
                toggleDrawer(true, event);
                setTask(null);

            }}
            variant="contained"
            className="px-3 py-2"
        >
            <Add className="fill-white text-xl" />
            <Typography variant="button" className="text-white">
                Add Task
            </Typography>
        </Button>
    );
};

export const TaskForm = ({ formik }) => {
    const [EmojiState, setEmojiState] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box className="grid gap-7 p-2">
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Box className="flex items-center">
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        className="aspect-square align-middle text-lg"
                        onClick={(event) => {
                            handleClick(event);
                            setEmojiState(true);
                        }}
                    >
                        {formik.values.icon}
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        <EmojiPicker
                            open={EmojiState}
                            onEmojiClick={(event) => {
                                console.log(event.emoji);
                                formik.setFieldValue("icon", event.emoji);
                                setEmojiState(false);
                                handleClose();
                            }}
                        />
                    </Menu>
                </Box>
                <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Title"
                    variant="standard"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />
            </Box>

            <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                variant="standard"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                multiline
                maxRows={6}
            />
            <Box className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <FormControl variant="standard" sx={{}}>
                    <InputLabel id="demo-simple-select-standard-label">
                        Priority
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                        label="Priority"
                        name="priority"
                    >
                        <MenuItem value={null}>none</MenuItem>
                        <MenuItem value={"low"}>low</MenuItem>
                        <MenuItem value={"casual"}>casual</MenuItem>
                        <MenuItem value={"medium"}>medium</MenuItem>
                        <MenuItem value={"high"}>high</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{}}>
                    <InputLabel id="demo-simple-select-standard-label">
                        Importance
                    </InputLabel>
                    <Select
                        id="importance"
                        name="importance"
                        variant="standard"
                        label="Importance"
                        value={formik.values.importance}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.importance && Boolean(formik.errors.importance)
                        }
                        helperText={formik.touched.importance && formik.errors.importance}
                    >
                        <MenuItem value={null}>none</MenuItem>
                        <MenuItem value={"low"}>low</MenuItem>
                        <MenuItem value={"medium"}>medium</MenuItem>
                        <MenuItem value={"high"}>high</MenuItem>
                        <MenuItem value={"critical"}>critical</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box className="grid grid-cols-1 place-content-end content-end gap-3 lg:grid-cols-2"></Box>
            <Box className="grid grid-cols-1 place-content-end content-end gap-3 lg:grid-cols-2">
                <DateTimePicker
                    // disablePast T// ODO: enable this feature depending on the task status
                    name="startTime"
                    label="Start Time"
                    format="DD/MM/YYYY-hh:MM"
                    defaultValue={formik.values.startTime}
                    value={formik.values.startTime}
                    // value={dayjs(formData.values.startTime)}
                    onError={(reason, value) => { }}
                    onChange={(date, dateType) => {
                        formik.setFieldValue([dateType], date.toDate(), true)
                    }}
                    slotProps={{
                        textField: {
                            variant: "outlined",
                            error:
                                formik.touched.startTime && Boolean(formik.errors.startTime),
                            helperText: formik.touched.startTime && formik.errors.startTime,
                        },
                    }}
                />
                <DateTimePicker
                    // disablePast // TODO: enable this feature depending on the task status
                    label="End Time"
                    name="endTime"
                    onError={(reason, value) => { }}
                    format="DD/MM/YYYY-hh:MM"
                    defaultValue={formik.values.endTime}
                    value={formik.values.endTime}
                    onChange={(date, dateType) => {
                        formik.setFieldValue([dateType], date.toDate(), true)
                    }}
                    slotProps={{
                        textField: {
                            variant: "outlined",
                            error: formik.touched.endTime && Boolean(formik.errors.endTime),
                            helperText: formik.touched.endTime && formik.errors.endTime,
                        },
                    }}
                />
            </Box>
            <Box className="grid grid-cols-1 place-content-end content-end gap-3 lg:grid-cols-2">
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                        Difficulty
                    </FormLabel>
                    <RadioGroup
                        row
                        id="difficulty"
                        name="difficulty"
                        variant="standard"
                        label="Difficulty"
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        value={formik.values.difficulty}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.difficulty && Boolean(formik.errors.difficulty)
                        }
                        helperText={formik.touched.difficulty && formik.errors.difficulty}
                    >
                        <FormControlLabel value="easy" control={<Radio />} label="Easy" />
                        <FormControlLabel
                            value="medium"
                            control={<Radio />}
                            label="Medium"
                        />
                        <FormControlLabel value="hard" control={<Radio />} label="Hard" />
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Status</FormLabel>
                    <RadioGroup
                        row
                        id="status"
                        variant="standard"
                        name="status"
                        label="Status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        error={formik.touched.status && Boolean(formik.errors.status)}
                        helperText={formik.touched.status && formik.errors.status}
                    >
                        <FormControlLabel
                            value="to-start"
                            control={<Radio />}
                            label="To Start"
                        />
                        <FormControlLabel
                            value="progress"
                            control={<Radio />}
                            label="progress"
                        />
                        <FormControlLabel value="done" control={<Radio />} label="Done" />
                    </RadioGroup>
                </FormControl>
            </Box>

            <Autocomplete
                multiple
                id="tags"
                options={tagIdeas}
                freeSolo
                value={formik.values.tags}
                onChange={(event, newValue) => {
                    formik.setFieldValue("tags", newValue);
                }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index + "-chips"}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Tags"
                        placeholder="Add tags"
                        error={formik.touched.tags && Boolean(formik.errors.tags)}
                        helperText={formik.touched.tags && formik.errors.tags}
                    />
                )}
            />
        </Box>
    );
};


export const tagIdeas = [
    "Work",
    "Personal",
    "Urgent",
    "Low Priority",
    "Home",
    "Office",
    "Shopping",
    "Fitness",
    "Health",
    "Finance",
    "Education",
    "Travel",
    "Leisure",
    "Important",
    "Meeting",
    "Deadline",
    "Project",
    "Event",
    "Reminder",
    "Task",
    "Appointment",
    "Birthday",
    "Anniversary",
    "Holiday",
    "Vacation",
    "Conference",
    "Seminar",
    "Workshop",
    "Training",
    "Webinar",
    "Interview",
    "Networking",
    "Presentation",
    "Report",
    "Review",
    "Feedback",
    "Brainstorming",
    "Strategy",
    "Planning",
    "Research",
    "Development",
    "Testing",
    "Deployment",
    "Maintenance",
    "Support",
    "Bug Fix",
    "Feature",
    "Improvement",
    "Optimization",
    "Documentation",
    "Design",
    "Prototype",
    "Analysis",
    "Consultation",
    "Collaboration",
    "Team Meeting",
    "Client Meeting",
    "Stakeholder Meeting",
    "Kickoff",
    "Wrap-up",
    "Follow-up",
    "Check-in",
    "Check-out",
    "Lunch",
    "Dinner",
    "Breakfast",
    "Brunch",
    "Snack",
    "Coffee Break",
    "Tea Break",
];
