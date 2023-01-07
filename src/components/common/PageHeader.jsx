import React from "react";
import { useDispatch } from "react-redux";
import { sidebarSlice } from "../../redux/slices/sidebar";

import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const PageHeader = ({
  title,
  onSubmit,
  submitLabel = "Зберегти",
  submitDisabled,
  onGoBack,
}) => {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const isMedium = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();

  const handleOpenSidebar = () => dispatch(sidebarSlice.actions.open());

  return (
    <header
      style={{
        width: "100%",
        height: "60px",
        backgroundColor: "var(--white)",
        fontWeight: "600",
        color: "var(--theme-color)",
        boxShadow: "0px 2px 24px rgb(0 0 25 / 15%)",
        position: "sticky",
        top: 0,
        zIndex: 1,
        borderBottom: "1px solid #1a2e229e",
      }}
    >
      <Box
        sx={{
          height: "100%",
          maxWidth: "1200px",
          mr: 2,
          ml: isDesktop ? 2 : 0,
          pr: 2,
          pl: isDesktop ? 2 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {!isDesktop && (
          <IconButton onClick={handleOpenSidebar}>
            <MenuRoundedIcon />
          </IconButton>
        )}
        {isMedium ? (
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              flex: "1 0 auto",
            }}
          >
            {title ?? ""}
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}
        {onGoBack && (
          <Button
            onClick={onGoBack}
            sx={{
              textTransform: "none",
              bgcolor: "var(--white)",
              padding: "4px 20px",
              color: "var(--theme-color)",
              "&:hover": {
                bgcolor: "#fff",
              },
            }}
          >
            Повернутися
          </Button>
        )}
        {onSubmit && (
          <Button
            disabled={submitDisabled}
            sx={{
              textTransform: "none",
              bgcolor: "var(--theme-color)",
              padding: "4px 20px",
              color: "var(--white)",
              "&:hover": { bgcolor: "#2c4c39" },
            }}
            onClick={onSubmit}
          >
            {submitLabel}
          </Button>
        )}
      </Box>
    </header>
  );
};

export default PageHeader;
