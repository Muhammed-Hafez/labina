import Link from "next/link";
import React from "react";
import styles from "./SecondaryCategories.module.scss";
import { useClientStore } from "@/lib/store/clientStore";

let bigCategories = [
  {
    _id: "1",
    imgUrl: "/images/home-banners1.jpg",
  },
];

let smallCategories = [
  {
    _id: "1",
    imgUrl: "/images/home-banners1.jpg",
  },
  {
    _id: "2",
    imgUrl: "/images/home-banners2.jpg",
  },
  {
    _id: "3",
    imgUrl: "/images/home-banners3.jpg",
  },
  {
    _id: "4",
    imgUrl: "/images/home-banners4.jpg",
  },
];

function SecondaryCategories() {
  const { homepageSettings } = useClientStore();

  return (
    <section className={styles["secondary"]}>
      <div className={styles["secondary__container"]}>
        <div className={styles["small__categories"]}>
          {homepageSettings?.advertisementSectionImageList.map((img) => (
            <div key={img}>
              <img src={"/api/static/images/homepage/" + img} alt="adv" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SecondaryCategories;
