import React from "react";
import Link from "next/link";
import { ButtonBase } from "@mui/material";
import { useTranslation } from "next-i18next";
import styles from "./TestCategories.module.scss";

const categoriesData = [
  {
    _id: "1",
    imgUrl: "/images/brand-1.png",
    slug: `nuts`,
    catList: ["Mixed Nuts", "Roasted Nuts", "Snacks"],
  },
  {
    _id: "2",
    imgUrl: "/images/brand-2.png",
    slug: `cosmetics`,
    catList: ["Soaps", "Creams", "Scrubs"],
  },
  {
    _id: "3",
    imgUrl: "/images/brand-3.png",
    slug: `coffee`,
    catList: ["Turkish Coffee", "Packed Coffee", "Flavored Coffee"],
  },
  {
    _id: "4",
    imgUrl: "/images/brand-4.png",
    slug: `healthy-corner`,
    catList: ["Honey", "Healthy Spreads", "Healthy Drinks"],
  },
  {
    _id: "5",
    imgUrl: "/images/brand-5.png",
    slug: `healthy-corner`,
    catList: ["Honey", "Healthy Spreads", "Healthy Drinks"],
  },
];

function TestCategories() {
  const { t } = useTranslation();

  return (
    <section className={styles["categories"]}>
      <div className={styles["categories__container"]}>
        {categoriesData.map((category) => (
          <div key={category._id} className={styles["card__container"]}>
            <div className={styles["category__img"]}>
              <img src={category.imgUrl} alt="" />
            </div>

            {/* <div className={styles["category__info"]}>
              <ul className={styles["category__list"]}>
                {category.catList.map((item) => (
                  <li key={item} className={styles["category__item"]}>
                    {t(item)}
                  </li>
                ))}
              </ul>

              <div className={styles["category__btn"]}>
                <ButtonBase
                  LinkComponent={Link}
                  href={"/category/" + category.slug}
                  className={styles["view__all"]}
                >
                  {t("ViewAll")}
                </ButtonBase>
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestCategories;
