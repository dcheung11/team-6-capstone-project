// Author: Damien Cheung
// Description: A loading overlay component that displays a spinner when loading.
// Last Modified: 2025-02-28

import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// LoadingOverlay: Displays a loading overlay with a spinner.
export default function LoadingOverlay(props) {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={props.loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
