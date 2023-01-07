import React, { Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sidebarSlice } from "../../redux/slices/sidebar";

import { StyledLinearProgress } from "../common/StyledComponents";
import { Box, Drawer, Grid, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width:900px)");
  const open = useSelector((state) => state.sidebar.open);

  const handleCloseDrawer = () => dispatch(sidebarSlice.actions.close());

  return (
    <Grid container columns={20} wrap="nowrap">
      {isDesktop ? (
        <Grid item xs={4} xl={3} component="aside" style={{ height: "auto" }}>
          <Sidebar />
        </Grid>
      ) : (
        <Drawer open={open && !isDesktop} onClose={handleCloseDrawer}>
          <Box sx={{ width: "300px", maxWidth: "90vw", overflow: "hidden" }}>
            <Sidebar handleCloseSidebar={handleCloseDrawer} />
          </Box>
        </Drawer>
      )}
      <Grid item xs={20} sm={20} md={16} lg={16} xl={17}>
        <Suspense fallback={<StyledLinearProgress />}>{children}</Suspense>
      </Grid>
    </Grid>
  );
};

export default Layout;
