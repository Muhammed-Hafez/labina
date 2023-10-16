import React from "react";
import styles from "./BrandSection.module.scss";
import { useClientStore } from "@/lib/store/clientStore";

function BrandSection() {
  const { homepageSettings } = useClientStore();

  return (
    <div className={styles["brand__section"]}>
      <img
        src={"/api/static/images/homepage/" + homepageSettings?.bannerTwoImage}
        alt="brand"
      />
    </div>
  );
}

export default BrandSection;
