import { AlertColor } from "@mui/material";

export interface INotify {
  _id?: string;
  type?: AlertColor;
  variant?: "filled" | "standard" | "outlined";
  message: string;
}
