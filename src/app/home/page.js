"use client";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import PrimaryLayout from "../PrimaryLayout";

export default function Home() {
  return (
    <PrimaryLayout>
      <Typography variant="overline" color="primary">
        hello there
      </Typography>
      <Box>
        <Typography color="primary">
          Testing
          <Button variant="contained" color="primary">
            Buytton
          </Button>
        </Typography>
      </Box>
    </PrimaryLayout>
  );
}
