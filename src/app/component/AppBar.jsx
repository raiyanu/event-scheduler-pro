import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Theme, themeChangeContext } from "../context/ThemeContext";
import { Fab, Icon, styled, ThemeProvider } from "@mui/material";
import {
    Add,
    CalendarMonth,
    Menu,
    More,
    MoreVert,
    Search,
    Settings,
    Home,
    DarkMode,
    LightMode,
} from "@mui/icons-material";

import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const drawerWidth = 200;
const navItems = ["Home", "About", "Contact"];

const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: -30,
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

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <Box
            sx={{
                height: "100%",
                maxHeight: "100%",
                minHeight: "100vh",
                overflowY: "hidden",
            }}
        >
            <CssBaseline />
            <AppBar
                component="nav"
                sx={{
                    top: { xs: "auto", sm: "initial" },
                    bottom: {
                        xs: 0,
                        sm: "initial",
                    },
                    bgcolor: "primary.main",
                    color: "black",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
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
                        <Menu />
                    </IconButton>
                    <StyledFab color="secondary" aria-label="add">
                        <AddIcon />
                    </StyledFab>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit">
                        <MoreVert />
                    </IconButton>
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
                    <Box>
                        <IconButton color="" onClick={toggleTheme}>
                            {
                                themeMode === "light" ? <DarkMode /> : <LightMode />
                            }
                        </IconButton>
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ maxHeight: "100vh", minHeight: "100vh" }}>
                <Toolbar
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />
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
                        zIndex: (theme) => theme.zIndex.drawer + 1,
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
                        },
                        flexWrap: "nowrap",
                        minHeight: "100vh",
                    }}
                >
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: "none", sm: "block" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: "100%",
                                position: "sticky",
                                zIndex: (theme) => theme.zIndex.drawer - 1,
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
                                    <ListItemButton
                                        title={item.title}
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
                                </Link>
                            ))}
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
        </Box>
    );
}

DrawerAppBar.propTypes = {
    window: PropTypes.func,
};

export default DrawerAppBar;
