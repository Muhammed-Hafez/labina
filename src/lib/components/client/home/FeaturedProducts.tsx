import { IProductGet } from "@/lib/@types/Product";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./FeaturedProducts.module.scss";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

const tabs = [
  {
    _id: "1",
    icon: "game-icons:coconuts",
    label: "Nuts",
    slug: "nuts",
  },
  {
    _id: "2",
    icon: "game-icons:hot-spices",
    label: "Spices",
    slug: "spices",
  },
  {
    _id: "3",
    icon: "game-icons:coffee-beans",
    label: "Coffee",
    slug: "coffee",
  },

  {
    _id: "4",
    icon: "game-icons:fruit-bowl",
    label: "DatesDriedFruits",
    slug: "dates-fruits",
  },
  {
    _id: "5",
    icon: "fluent:drink-margarita-20-regular",
    label: "Drinks",
    slug: "beverages",
  },
];

function FeaturedProducts({ productList }: { productList: IProductGet[] }) {
  const [activeTab, setActiveTab] = useState("");
  const { t } = useTranslation();

  const filteredData = activeTab
    ? productList.filter((x: any) => x.category.slug === activeTab)
    : productList;

  return (
    <section className={styles["featured__products"]}>
      <div className={styles["featured__container"]}>
        <h2 className={styles["featured__title"]}>{t("FeaturedProducts")}</h2>

        <div className={styles["tabs__container"]}>
          {tabs.map((tab) => (
            <button
              key={tab._id}
              className={`${styles["tabs"]} ${
                activeTab === tab.slug ? styles["active"] : ""
              }`}
              onClick={() => {
                setActiveTab(tab.slug);
              }}
            >
              <Icon
                icon={tab.icon}
                color={activeTab === tab.slug ? "var(--primary)" : "black"}
              />
              {t(tab.label)}
            </button>
          ))}
        </div>

        <ProductCarousel productList={filteredData} />

        <Link href={"/featured-products"} className={styles["show__all"]}>
          <span>{t("Showall")}</span>
        </Link>
      </div>
    </section>
  );
}

export default FeaturedProducts;
