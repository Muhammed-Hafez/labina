import { CircularProgress } from "@mui/material";
import React from "react";
import styles from "./Loader.module.scss";

function Loader() {
  return (
    <div
      className={styles.loeader__container}
      onScroll={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <CircularProgress
        style={{ height: "128px", width: "128px", color: "var(--primary)" }}
      />
    </div>
  );
}

export default Loader;
