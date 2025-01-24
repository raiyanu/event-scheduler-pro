"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, ButtonGroup, Grid, Grid2, Input, Link, TextField, Typography } from "@mui/material";
import { Facebook, Google, Instagram, Label } from "@mui/icons-material";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Box>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box className="flex h-screen w-screen items-center justify-start text-black dark:text-white">
            <Box sx={{ width: "300px", marginInline: "auto", height: "500px" }} className="rounded-md border-2 p-4 shadow-2xl">
                <Box sx={{ borderBottom: 1, borderColor: "Boxider" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        sx={{ width: "100%" }}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Login" {...a11yProps(0)} sx={{ width: "50%" }} />
                        <Tab label="Sign up" {...a11yProps(1)} sx={{ width: "50%" }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Box className="flex flex-col gap-4">
                        <Box className="flex flex-col gap-4">
                            <TextField id="standard-basic" label="EMAIL" variant="standard" />
                            <TextField
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                variant="standard"
                            />
                        </Box>
                        <Button variant="contained" className="w-full" onClick={() => {
                            window.location.href = '/home';
                        }}>
                            Login
                        </Button>
                        <Link className="m-0 text-end" variant="caption" href="#">Forgot password?</Link>
                        <Typography variant="subtitle1" className="mx-auto">or</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginInline: "auto",
                                '& > *': {
                                    m: 1,
                                },
                            }}
                        >
                            <ButtonGroup size="small" aria-label="Small button group">
                                <Button variant="contained" className="w-full">
                                    <Google />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup size="small" aria-label="Small button group">
                                <Button variant="contained" className="w-full">
                                    <Facebook />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup size="small" aria-label="Small button group">
                                <Button variant="contained" className="w-full">
                                    <Instagram />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Box>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Box className="flex flex-col gap-4">
                        <Box className="flex flex-col gap-4">
                            <TextField id="standard-basic" label="EMAIL" variant="standard" />
                            <TextField
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                variant="standard"
                            />
                        </Box>
                        <Button variant="contained" className="w-full">
                            Sign Up
                        </Button>
                        <Typography variant="subtitle1" className="mx-auto">or</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginInline: "auto",
                                '& > *': {
                                    m: 1,
                                },
                            }}
                        >
                            <ButtonGroup size="small" aria-label="Small button group">
                                <Button variant="contained" className="w-full">
                                    <Google />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup size="small" aria-label="Small button group">
                                <Button variant="contained" className="w-full">
                                    <Facebook />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup size="small" aria-label="Small button group">
                                <Button variant="contained" className="w-full">
                                    <Instagram />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Box>
                </CustomTabPanel>
            </Box>
        </Box>
    );
}
