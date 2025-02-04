import { createContext, Fragment, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Alert, Box, Chip, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Delete, Info } from "@mui/icons-material";
import { useDialogs } from "@toolpad/core";
import PropTypes from "prop-types";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { deleteTasks } from "../redux/slice/taskSlice";
import { useDispatch } from "react-redux";

export const TaskDetailPanelContext = createContext();

export default function TaskDetailPanelProvider({ children }) {
    const [info, setInfo] = useState({});
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleClickOpen = (INFO) => {
        if (!info) {
            return;
        }
        console.log(INFO);
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
    return (
        <>
            <TaskDetailPanelContext.Provider value={{ handleClickOpen }}>
                <>{children}</>
            </TaskDetailPanelContext.Provider>
            <Dialog
                fullScreen={fullScreen}
                maxWidth="md"
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {info?.title ? info.title : "--"}
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
                <DialogContent className="*:mt-2">
                    <DialogContentText className="p-0 *:mt-2" variant="body1">
                        {info?.description ? info.description : "--"}
                    </DialogContentText>
                    <Box className="flex gap-2">
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
                <DialogActions className="justify-between">
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
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="warning"
                        autoFocus
                    >
                        Save
                    </Button>

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
