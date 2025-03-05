import React from "react";
import { Box, Typography, IconButton, Link } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#1c355d",
        color: "white",
        textAlign: "center",
        py: 2,
      }}
    >
      <Typography variant="body1">BWR Bombas © 2024</Typography>
      <Box sx={{ mt: 1 }}>
        <Link href="https://wa.me/551144564595" color="inherit" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <WhatsAppIcon />
          </IconButton>
        </Link>
        <Link href="#" color="inherit" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <FacebookIcon />
          </IconButton>
        </Link>
        <Link href="#" color="inherit" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <TwitterIcon />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;