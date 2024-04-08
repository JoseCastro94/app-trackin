import PropTypes from "prop-types";
import { useState, useEffect } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer,
  useMediaQuery
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import MenuList from "./MenuList";
import LogoSection from "../LogoSection";
// import MenuCard from './MenuCard';
import { drawerWidth, drawerWidthClose } from "../../../store/constant";


// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const drawer = (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
          <LogoSection />
        </Box>
      </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
            paddingLeft: "13px",
            paddingRight: "14px",
            backgroundColor: "#000064",
          }}
        >
          <MenuList drawerOpen={drawerOpen} />
          {/* <MenuCard /> */}
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList />
          {/* <MenuCard /> */}
        </Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  const [open, setOpen] = useState("360");

  useEffect(() => {
    // console.log(drawerOpen);
    if (open == "360px") {
      setOpen("360px");
    } else {
      setOpen("80px");
    }
  }, [drawerOpen]);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd
          ? drawerOpen
            ? drawerWidth
            : drawerWidthClose
          : "auto",
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? "persistent" : "temporary"}
        anchor="left"
        open={true}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : drawerWidthClose,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              top: "88px",
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object,
};

export default Sidebar;
