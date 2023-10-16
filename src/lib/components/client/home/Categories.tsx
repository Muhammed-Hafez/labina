import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./Categories.module.scss";
import "@splidejs/react-splide/css/core";
import { Splide, SplideSlide } from "@splidejs/react-splide";

const categoriesData = [
  {
    _id: "1",
    imgUrl: "/images/brand-1.png",
    slug: `prada`,
  },
  {
    _id: "2",
    imgUrl: "/images/brand-2.png",
    slug: `versace`,
  },
  {
    _id: "3",
    imgUrl: "/images/brand-3.png",
    slug: `dg`,
  },
  {
    _id: "4",
    imgUrl: "/images/brand-4.png",
    slug: `gucci`,
  },
  {
    _id: "5",
    imgUrl: "/images/brand-5.png",
    slug: `ysl`,
  },
  {
    _id: "6",
    imgUrl: "/images/brand-6.png",
    slug: `tory-burch`,
  },
];

function Categories() {
  const { t } = useTranslation();

  return (
    <section className={styles["categories"]}>
      <div className={styles["categories__container"]}>
        {categoriesData.map((category) => (
          <div key={category._id} className={styles["card__container"]}>
            <div className={styles["category__img"]}>
              <img src={category.imgUrl} alt="" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
