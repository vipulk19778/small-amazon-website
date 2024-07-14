import { Typography } from "@mui/material";
import React from "react";

const MessageBox = (props) => {
  return <Typography sx={{ color: "red" }}>{props.children}</Typography>;
};

export default MessageBox;
