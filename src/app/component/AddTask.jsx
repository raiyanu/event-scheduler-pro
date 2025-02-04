"use client";
import {
    Add,
    AddCircle,
    AddCircleOutline,
    AddCircleSharp,
    Close,
    MoreVert,
} from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    Menu,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import EmojiPicker from "emoji-picker-react";

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
                    <AddTaskContainer />
                </Box>
            </Box>
        </Box>
    );
}

export default function AddTaskContainer() {
    return <AddTask />;
}

export function AddTask() {
    return <SwipeableTemporaryDrawer />;
}

export function SwipeableTemporaryDrawer() {
    const [drawerState, setDrawerState] = useState(true);
    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setDrawerState(open);
    };

    return (
        <div>
            <>
                <Button
                    onClick={toggleDrawer(true)}
                    variant="contained"
                    className="px-3 py-2"
                >
                    <Add className="fill-white text-xl" />
                    <Typography variant="button" className="text-white">
                        Add Task
                    </Typography>
                </Button>
                <SwipeableDrawer
                    anchor={"bottom"}
                    open={drawerState}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    sx={{
                        "& .MuiDrawer-paper": {
                            bgcolor: "green",
                            width: "100%",
                            maxWidth: "700px",
                            minWidth: "300px",
                            marginInline: "auto",
                        },
                        "& .MuiDrawer-modal": {
                            backdropFilter: "blur(10px)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
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
                        <DrawerContent toggleDrawer={toggleDrawer} />
                    </Paper>
                </SwipeableDrawer>
            </>
        </div>
    );
}

const DrawerContent = ({ toggleDrawer }) => {
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            priority: "",
            dueDate: "",
            removedAt: null,
            endTime: null,
            importance: "",
            icon: "📖",
            isRepeated: "",
            difficulty: "",
            createdAt: null,
            status: "",
            tags: [],
            startTime: null,
        },
        onSubmit: (values) => {
            let startTime = values.startTime;
            values.startTime = {
                seconds: Math.floor(startTime / 1000),
                nanoseconds: startTime * 1000000,
            };

            let createdAt = values.createdAt;
            values.createdAt = {
                seconds: Math.floor(createdAt / 1000),
                nanoseconds: createdAt * 1000000,
            };

            let removedAt = values.removedAt;
            values.removedAt = {
                seconds: Math.floor(removedAt / 1000),
                nanoseconds: removedAt * 1000000,
            };

            let endTime = values.endTime;
            values.endTime = {
                seconds: Math.floor(endTime / 1000),
                nanoseconds: endTime * 1000000,
            };
            console.log(values);
        },
    });
    return (
        <>
            <Box className="grid h-full grid-flow-row grid-rows-[50px_1fr_50px] gap-4">
                {/* Header */}
                <Box>
                    <Box className="flex w-full items-start justify-between">
                        <Typography variant="h5" className="p-3">
                            Add Task
                        </Typography>
                        <IconButton onClick={toggleDrawer(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Divider />
                </Box>
                {/* Body */}
                <Box className="overflow-y-hidden">
                    <Box className="h-full overflow-y-scroll">
                        <AddTaskForm formik={formik} />
                    </Box>
                </Box>
                {/* Footer */}
                <Box>
                    <Divider />
                    <Box className="mt-4 flex items-center justify-end gap-3 *:flex-grow-0">
                        <Button variant="text" onClick={toggleDrawer(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained"
                            onClick={formik.handleSubmit}
                        >Add Task</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
const AddTaskForm = ({ formik }) => {
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
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Box className="flex items-center">
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        className="h-8 align-middle text-lg"
                        onClick={(event) => {
                            handleClick(event);
                            setEmojiState(!EmojiState)

                        }}>
                        {formik.values.icon}
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <EmojiPicker
                            open={EmojiState}
                            onEmojiClick={(event) => {
                                console.log(event.emoji)
                                formik.setFieldValue("icon", event.emoji)
                                setEmojiState(!EmojiState)
                                handleClose()
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
            />
            <Box className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <TextField
                    id="priority"
                    name="priority"
                    variant="standard"
                    label="Priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    error={formik.touched.priority && Boolean(formik.errors.priority)}
                    helperText={formik.touched.priority && formik.errors.priority}
                />
                <TextField
                    id="importance"
                    name="importance"
                    variant="standard"
                    label="Importance"
                    value={formik.values.importance}
                    onChange={formik.handleChange}
                    error={formik.touched.importance && Boolean(formik.errors.importance)}
                    helperText={formik.touched.importance && formik.errors.importance}
                />
            </Box>
            <Box className="grid grid-cols-1 place-content-end content-end gap-3 lg:grid-cols-2">
                <TextField
                    fullWidth
                    id="dueDate"
                    variant="standard"
                    name="dueDate"
                    type="date"
                    value={formik.values.dueDate}
                    onChange={formik.handleChange}
                    error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                    helperText={formik.touched.dueDate && formik.errors.dueDate}
                    className="*:h-full"
                />

                <TextField
                    fullWidth
                    id="isRepeated"
                    variant="standard"
                    name="isRepeated"
                    label="Is Repeated"
                    value={formik.values.isRepeated}
                    onChange={formik.handleChange}
                    error={formik.touched.isRepeated && Boolean(formik.errors.isRepeated)}
                    helperText={formik.touched.isRepeated && formik.errors.isRepeated}
                />
            </Box>
            <TextField
                fullWidth
                id="difficulty"
                name="difficulty"
                variant="standard"
                label="Difficulty"
                value={formik.values.difficulty}
                onChange={formik.handleChange}
                error={formik.touched.difficulty && Boolean(formik.errors.difficulty)}
                helperText={formik.touched.difficulty && formik.errors.difficulty}
            />
            <TextField
                fullWidth
                id="status"
                variant="standard"
                name="status"
                label="Status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
            />
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


const tagIdeas = [
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
    "Tea Break"
]