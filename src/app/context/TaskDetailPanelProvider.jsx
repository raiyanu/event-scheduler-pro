import { createContext, useState } from "react";
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
    Select, Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    Delete, HourglassBottom, PushPin,
    Tag,
    WorkspacePremium
} from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { deleteTasks, updateTask } from "../redux/slice/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { ClockIcon } from "@mui/x-date-pickers";
import { UpdateTaskButton } from "../component/AddTask";
export const TaskDetailPanelContext = createContext();
export const taskPaneViewHandler = createContext();

export default function TaskDetailPanelProvider({ children }) {
    const [info, setInfo] = useState({});
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.up("300px"));
    const handleClickOpen = (INFO) => {
        if (!info) return;
        setInfo(INFO);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openActionModal, setOpenActionModal] = useState(false);
    const handleOpenActionModal = () => setOpenActionModal(true);
    const handleCloseActionModal = () => setOpenActionModal(false);
    const displatch = useDispatch();
    const [markdown, setMarkdown] = useState("");
    return (
        <>
            <taskPaneViewHandler.Provider
                value={{
                    handleModalClose: () => {
                        handleClose();
                    },
                }}
            >
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
                            minWidth: "50%",
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
                            <CloseIcon />
                        </IconButton>
                    </Box>
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
                            {info?.difficulty && (
                                <Typography variant="">
                                    <Tooltip title="Difficulty">
                                        <WorkspacePremium />{" "}
                                        {info?.difficulty ? info.difficulty : "--"}
                                    </Tooltip>
                                </Typography>
                            )}
                            {info?.importance && (
                                <Typography variant="">
                                    <Tooltip title="Importance">
                                        <Ribbon /> {info?.importance ? info.importance : "--"}
                                    </Tooltip>
                                </Typography>
                            )}
                        </Box>
                        <Box className="grid grid-cols-2">
                            {info?.priority && (
                                <Typography variant="">
                                    <Tooltip title="Priority">
                                        <PushPin /> {info?.priority ? info.priority : "--"}
                                    </Tooltip>
                                </Typography>
                            )}
                            {info?.status && (
                                <Typography>
                                    <Tooltip title="Status">
                                        <HourglassBottom />{" "}
                                        {info?.status ? friendlyStatus(info.status) : "--"}
                                    </Tooltip>
                                </Typography>
                            )}
                        </Box>
                        {info?.tags && (
                            <Box className="flex gap-2">
                                <Tag />
                                <Box className="flex flex-wrap gap-2">
                                    {
                                        info.tags &&
                                        info.tags.length >= 0 &&
                                        info.tags.map((tag, index) => (
                                            <Chip
                                                label={tag}
                                                key={index.toString() + "-myTaskElementTags"}
                                                variant="outlined"
                                                color="warning"
                                                size="small"
                                            />
                                        ))
                                    }
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions className="mt-4 justify-between">
                        <Box className="flex justify-between">
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
                            <UpdateTaskButton task={info} handleClose={handleClose} />
                        </Box>
                        <Box className="flex gap-2 *:flex-shrink-0 *:flex-grow-0">
                            <Box className="flex gap-1 max-md:flex-col">
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
                                            await handleClose();
                                        }}
                                    >
                                        Updated
                                    </Button>
                                )}
                            </Box>
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
            </taskPaneViewHandler.Provider>
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

export const Ribbon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5" viewBox="0 0 20 20">
        <path d="M16.574 16.338c-.757-1.051-2.851-3.824-4.57-6.106.696-.999 1.251-1.815 1.505-2.242 1.545-2.594.874-4.26.022-5.67C12.677.909 12.542.094 10 .094c-2.543 0-2.678.815-3.531 2.227-.854 1.41-1.524 3.076.021 5.67.254.426.809 1.243 1.506 2.242-1.72 2.281-3.814 5.055-4.571 6.106-.176.244-.16.664.009 1.082.13.322.63 1.762.752 2.064.156.389.664.67 1.082.092.241-.334 2.582-3.525 4.732-6.522 2.149 2.996 4.491 6.188 4.732 6.522.417.578.926.297 1.082-.092.122-.303.622-1.742.752-2.064.167-.419.184-.839.008-1.083zm-6.94-9.275C8.566 5.579 7.802 3.852 7.802 3.852s.42-.758 2.198-.758 2.198.758 2.198.758-.766 1.727-1.833 3.211L10 7.56a40.64 40.64 0 0 1-.366-.497z" />
    </svg>
);
