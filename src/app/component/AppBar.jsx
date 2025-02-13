import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { themeChangeContext } from "../context/ThemeContext";
import { Button, Fab, Fade, Menu, MenuItem, Popper, styled, Switch, Tooltip } from "@mui/material";
import {
    CalendarMonth,
    MoreVert, Settings,
    Home,
    DarkMode,
    LightMode,
} from "@mui/icons-material";

import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AddTaskButton, TaskCrudDrawerContext } from "./AddTask";
const drawerWidth = 200;
const navItems = ["Home", "About", "Contact"];

const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: -20,
    left: 0,
    right: 0,
    margin: "0 auto",
});

let navigation = [];

function DrawerAppBar(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const { toggleTheme, themeMode } = React.useContext(themeChangeContext);

    const pathname = usePathname();

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
    const { toggleDrawer, setTask } = React.useContext(TaskCrudDrawerContext);


    const container =
        window !== undefined ? () => window().document.body : undefined;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box
            sx={{
                height: "100%",
                maxHeight: "100%",
                minHeight: "100vh",
                overflowY: "hidden",
                display: "flex",
                width: "100%",
            }}
        >
            <CssBaseline />
            <AppBar
                component="header"
                sx={{
                    top: { xs: "auto", sm: "initial" },
                    bottom: {
                        xs: 0,
                        sm: "initial",
                    },
                    bgcolor: "background.default",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottom: themeMode === "light" ? "" : "1px solid rgba(255, 255, 255, 0.12)",
                }}
            >
                <Toolbar sx={{ display: { xs: "flex", sm: "none" } }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => {
                            handleDrawerToggle();
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <StyledFab color="secondary" aria-label="add" onClick={() => {
                        toggleDrawer(true, event);
                        setTask(null);
                    }}>
                        <AddIcon />
                    </StyledFab>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <IconButton
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}

                        >
                            <MoreVert />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            sx={{
                                transform: 'translateY(-12px)',

                            }}
                            transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        >
                            <Box sx={{
                                px: 2,
                                py: 1
                            }}>
                                <Box className="flex items-center gap-3">
                                    Darkmode
                                    <Switch
                                        checked={themeMode === "dark"}
                                        onChange={toggleTheme}
                                        color="primary"
                                        name="checkedB"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Toolbar>
                <Toolbar sx={{ display: { xs: "none", sm: "flex", justifyContent: "space-between" } }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link href={"/"}>
                        <Typography
                            variant="h3"
                            component="div"
                            color="primary.contrastText"
                            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                        >
                            ES<sup className="-top-4 text-xs">Pro</sup>
                        </Typography>
                    </Link>
                    <Box className="flex gap-3">
                        <IconButton color="" onClick={toggleTheme}>
                            {
                                themeMode === "light" ? <DarkMode /> : <LightMode />
                            }
                        </IconButton>
                        <AddTaskButton />
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{
                maxHeight: "100vh",
                flexGrow: 1,
                display: "flex",
                minWidth: "100%",
                flexShrink: 0,
                flexBasis: "100%",
                flexDirection: "column",
            }}>
                <Toolbar
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />
                {/* SideBar drawer */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                    }}
                >
                    <Box onClick={handleDrawerToggle} sx={{ minWidth: "100%" }}>
                        <Divider />
                        <Box>
                            {[
                                {
                                    segment: "home",
                                    title: "Home",
                                    icon: <Home />,
                                },
                                {
                                    segment: "calendar",
                                    title: "Calendar",
                                    icon: <CalendarMonth />,
                                    pattern: "calendar",
                                },
                                {
                                    segment: "setting",
                                    title: "Setting",
                                    icon: <Settings />,
                                    pattern: "setting",
                                },
                            ].map((item, index) => (
                                <Link href={`/${item && item.segment}`} key={index}>
                                    <ListItemButton
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "24px 1fr",
                                            gap: "18px",
                                            m: 0.75,
                                            borderRadius: "8px",
                                            bgcolor: pathname === `/${item.segment}` ? 'primary.light' : 'transparent',
                                        }}
                                    >
                                        <IconButton disableRipple>{item.icon}</IconButton>
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                </Link>
                            ))}
                        </Box>
                    </Box>
                </Drawer>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "60px 1fr",
                            md: `${drawerWidth}px 1fr`,
                        }, // TODO: FIX THIS
                        flexWrap: "nowrap",
                        minHeight: "100vh",
                    }}
                >
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: "none", sm: "flex" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: "100%",
                                position: "sticky",
                                zIndex: (theme) => theme.zIndex.drawer - 1,
                                display: "flex",
                                flexDirection: "col",
                                justifyContent: "space-between",
                            },
                            width: "100%",
                            zIndex: (theme) => theme.zIndex.drawer - 1,
                            position: "relative",
                            overflow: "hidden",
                            maxHeight: "100vh",
                        }}
                        open
                    >
                        <Box onClick={handleDrawerToggle} sx={{ minWidth: "100%", mt: 1 }}>
                            {[
                                {
                                    segment: "home",
                                    title: "Home",
                                    icon: <Home />,
                                },
                                {
                                    segment: "calendar",
                                    title: "Calendar",
                                    icon: <CalendarMonth />,
                                    pattern: "calendar",
                                },
                                {
                                    segment: "setting",
                                    title: "Setting",
                                    icon: <Settings />,
                                    pattern: "setting",
                                },
                            ].map((item, index) => (
                                <Link href={`/${item && item.segment}`} key={index} className="max-sm:mt-[1rem]">
                                    <Tooltip title={item.title} placement="right">

                                        <ListItemButton
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "1fr",
                                                    md: "24px 1fr",
                                                },
                                                gap: "18px",
                                                m: {
                                                    xs: 0.45,
                                                    md: 0.75,
                                                },
                                                padding: {
                                                    xs: "0",
                                                    md: "0.3rem .5rem",
                                                },
                                                borderRadius: "8px",
                                                bgcolor: pathname === `/${item.segment}` ? 'primary.main' : 'transparent',
                                                "&:hover": {
                                                    bgcolor: "primary.light",
                                                },
                                            }}
                                        >
                                            <IconButton disableRipple>{item.icon}</IconButton>
                                            <ListItemText sx={{
                                                display: { xs: "none", md: "block" },
                                            }} primary={item.title} />
                                        </ListItemButton>
                                    </Tooltip>

                                </Link>
                            ))}
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                            hey there
                        </Box>
                    </Drawer>
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            maxHeight: "100vh",
                            minHeight: "max-content",
                            overflowY: "clip",
                            mt: 1,
                            pb: {
                                xs: 8,
                                md: 1
                            }
                        }}
                    >
                        {props.children}
                    </Box>
                </Box>
            </Box>
        </Box >
    );
}

DrawerAppBar.propTypes = {
    window: PropTypes.func,
};

export default DrawerAppBar;