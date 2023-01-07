import React from "react";
import { useLocation } from "react-router-dom";

import { Button } from "@mui/material";

const SidebarButton = ({ label, to, onClick }) => {
  const location = useLocation();

  return (
    <Button
      style={{
        width: "calc(100% - 20px)",
        margin: "10px 10px 0",
        textTransform: "none",
        color: "var(--white)",
        backgroundColor: `${location.pathname}`.includes(`${to}`)
          ? "var(--menu-active-button-color)"
          : "var(--menu-button-color)",
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default SidebarButton;
