import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";

// project imports
import NavItem from "../NavItem";

// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level, drawerOpen }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [position, setPosition] = useState();
  const opened = Boolean(anchorEl);
  const handle = (event) => {
    setAnchorEl(event.currentTarget);
    setPosition(event.currentTarget);
  };

  const handleCloseFromMenu = (event) => {
    setAnchorEl(position);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // console.log(drawerOpen);
    if (!drawerOpen) {
      setOpen(false);
      // setSelected(!selected ? menu.id : null);
    }
  }, [drawerOpen]);

  const handleClick = () => {
    if (drawerOpen) {
      setOpen(!open);
      setSelected(!selected ? menu.id : null);
    }
  };

  // menu collapse & item
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case "collapse":
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case "item":
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? (
    <Icon
      strokeWidth={1.5}
      size="1.3rem"
      style={{width: drawerOpen ? '1rem' : '1.5rem', height: drawerOpen ? '1rem' : '1.5rem' ,marginTop: "auto", marginBottom: "auto" }}
    />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: selected === menu.id ? 8 : 6,
        height: selected === menu.id ? 8 : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          mb: 0.5,
          alignItems: "flex-start",
          backgroundColor: level > 1 ? "transparent !important" : "inherit",
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
          color: "white",
        }}
        selected={selected === menu.id}
        onClick={drawerOpen ? handleClick : handle}
        onMouseEnter={!drawerOpen && handle}
        onMouseLeave={!drawerOpen && handleClose}
      >
        <Tooltip title={menu.title} arrow placement="right">
          <ListItemIcon
            style={{
              // width: drawerOpen ? "1rem" : "1.2rem",
              // height: drawerOpen ? "1rem" : "1.2rem",
              marginLeft: "-10px",
            }}
            sx={{ my: "auto", color: "white", minWidth: !menu.icon ? 18 : 36 }}
          >
            {menuIcon}
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary={
            <Typography
              style={{ marginLeft: "8px" }}
              variant={selected === menu.id ? "h5" : "body1"}
              color="inherit"
              sx={{ my: "auto" }}
            >
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography
                variant="caption"
                sx={{ ...theme.typography.subMenuCaption }}
                display="block"
                gutterBottom
              >
                {/* {menu.caption}  */}a
              </Typography>
            )
          }
        />
        {open ? (
          <IconChevronUp
            stroke={1.5}
            size="1rem"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
        ) : (
          <IconChevronDown
            stroke={1.5}
            size="1rem"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
        )}
      </ListItemButton>
      <Collapse
        in={drawerOpen ? open : true}
        undefined
        timeout="auto"
        unmountOnExit
      >
        {!drawerOpen ? (
          <Menu
            className="menu-display"
            anchorEl={anchorEl}
            open={opened}
            style={{ marginLeft: 60 }}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <List
              component="div"
              disablePadding
              onMouseEnter={handleCloseFromMenu}
              onMouseLeave={handleClose}
              sx={{
                position: "relative",
                "&:after": {
                  content: "''",
                  position: "absolute",
                  left: "32px",
                  top: 0,
                  height: "100%",
                  width: "1px",
                  opacity: 1,
                  background: theme.palette.primary.light,
                },
              }}
            >
              {menus}
            </List>
          </Menu>
        ) : (
          <List
            component="div"
            disablePadding
            sx={{
              position: "relative",
              "&:after": {
                content: "''",
                position: "absolute",
                left: "32px",
                top: 0,
                height: "100%",
                width: "1px",
                opacity: 1,
                background: theme.palette.primary.light,
              },
            }}
          >
            {menus}
          </List>
        )}
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
};

export default NavCollapse;
