import React from "react";
import { Box, useMediaQuery } from "@mui/material";

const Page = ({ children }) => {
  const isDesktop = useMediaQuery("(min-width:900px)");

  return (
    <Box
      sx={{
        p: isDesktop ? 2 : 1,
      }}
    >
      <Box
        sx={{
          borderRadius: "5px",
          bgcolor: "#fff",
          maxWidth: 1200,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Page;
