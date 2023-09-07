import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function InputBox() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        "& > :not(style)": { m: 1 },
      }}
    >
      <TextField
        helperText="Please enter your Calendar's name"
        id="demo-helper-text-misaligned"
        label="Name"
      />
    </Box>
  );
}
