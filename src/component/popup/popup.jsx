import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
const Popup = (props) => {
  const { title, children, OpenPopup, setOpenPopup } = props;

  return (
    <Dialog open={OpenPopup}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Popup;
