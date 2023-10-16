import React from "react";
import styles from "./OfferSection.module.scss";
import Link from "next/link";
import { useClientStore } from "@/lib/store/clientStore";

function OfferSection() {
  const { homepageSettings } = useClientStore();

  return (
    <div className={styles["offer__section"]}>
      <Link href="/category/healthy-corner">
        <img
          src={
            "/api/static/images/homepage/" + homepageSettings?.bannerOneImage
          }
          alt="offer"
        />
      </Link>
    </div>
  );
}

export default OfferSection;
