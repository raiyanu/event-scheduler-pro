import { createContext, Fragment, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
    Alert,
    Box,
    Chip,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Delete, Edit, Info } from "@mui/icons-material";
import { useDialogs } from "@toolpad/core";
import PropTypes from "prop-types";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { deleteTasks, updateTask } from "../redux/slice/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { Clock } from "@mui/x-date-pickers/TimeClock/Clock";
import { ClockIcon } from "@mui/x-date-pickers";

export const TaskDetailPanelContext = createContext();

export default function TaskDetailPanelProvider({ children }) {
    const [info, setInfo] = useState({});
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.up("300px"));
    const handleClickOpen = (INFO) => {
        if (!info) {
            return;
        }
        setInfo(INFO);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openActionModal, setOpenActionModal] = useState(false);
    const handleOpenActionModal = () => setOpenActionModal(true);
    const handleCloseActionModal = () => setOpenActionModal(false);
    const taskCRUDStatus = useSelector((state) => state.TASK.taskCRUD);
    const displatch = useDispatch();

    const [markdown, setMarkdown] = useState("");
    return (
        <>
            <TaskDetailPanelContext.Provider value={{ handleClickOpen }}>
                {children}
            </TaskDetailPanelContext.Provider>
            <Dialog
                fullScreen={fullScreen}
                maxWidth="lg"
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                sx={{
                    ".MuiDialog-paper": {
                        minWidth: "460px",
                        maxWidth: "600px",
                    },
                }}
            >
                <DialogTitle id="responsive-dialog-title" className="flex items-center">
                    <span className="text-3xl">{info?.icon ? info.icon : "--"}</span>
                    <span className="text-xl">{info?.title ? info.title : "--"}</span>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent className="px-6 py-0 *:mt-3">
                    <Box className="flex items-center gap-2">
                        <ClockIcon />
                        <Box className="flex flex-shrink-0">
                            <Typography>
                                {info?.startTime
                                    ? formatDate(new Date(info.startTime.seconds * 1000))
                                    : "--"}
                            </Typography>
                            <Divider
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
                            Difficulty: {info?.difficulty ? info.difficulty : "--"}
                        </Typography>
                        <Typography variant="">
                            Importance: {info?.importance ? info.importance : "--"}
                        </Typography>
                    </Box>
                    <Box className="grid grid-cols-2">
                        <Typography variant="">
                            Priority: {info?.priority ? info.priority : "--"}
                        </Typography>
                        <Typography variant="">
                            status: {info?.status ? friendlyStatus(info.status) : "--"}
                        </Typography>
                    </Box>
                    {/* <Box>
                        <Typography variant="button">
                            Created At: 
                            {info?.createdAt ? new Date(info.createdAt.seconds * 1000).toLocaleString() : "--"}
                        </Typography>
                    </Box> */}
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
                </DialogContent>
                <DialogActions className="mt-4 justify-between">
                    <Box className="justify-between">
                        <IconButton
                            onClick={() => {
                                handleClose();
                                handleOpenActionModal();
                            }}
                            variant="contained"
                            color="warning"
                            autoFocus
                        >
                            <Delete />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                handleClose();
                                handleOpenActionModal();
                            }}
                            variant="contained"
                            color="warning"
                            autoFocus
                        >
                            <Edit />
                        </IconButton>
                    </Box>
                    <Box className="flex gap-2 *:flex-shrink-0 *:flex-grow-0">
                        <Box className="flex gap-1">
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
                                    onClick={async () => {
                                        await displatch(
                                            updateTask({ id: info.id, task: { status: markdown } })
                                        );
                                        // handleClose();
                                    }}
                                >
                                    Updated
                                </Button>
                            )}
                        </Box>

                        <Button
                            onClick={handleClose}
                            variant="contained"
                            color="warning"
                            autoFocus
                            className="h-10"
                        >
                            Close
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openActionModal}
                onClose={handleCloseActionModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openActionModal}>
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
                                        await displatch(deleteTasks(info.id));
                                        handleCloseActionModal();
                                        handleClose();
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => {
                                        handleCloseActionModal();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Alert>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
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

export function formatDate(date) {
    const options = {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
    };
    return new Date(date).toLocaleString("en-GB", options).replace(",", " :");
}
