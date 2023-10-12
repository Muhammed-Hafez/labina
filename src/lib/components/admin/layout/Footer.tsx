import styles from "./Footer.module.scss";

import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className={styles["footer"]}>
      Powered by{" "}
      <Link
        href="https://triangles-eg.com"
        target="_blank"
        rel="noreferrer"
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        Triangles
      </Link>{" "}
      &copy; 2023
    </footer>
  );
}

export default Footer;
