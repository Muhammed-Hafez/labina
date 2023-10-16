import { IProductGet } from "@/lib/@types/Product";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./FeaturedProducts.module.scss";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

function FeaturedProducts({ productList }: { productList: IProductGet[] }) {
  const { t } = useTranslation();

  return (
    <section className={styles["featured__products"]}>
      <div className={styles["featured__container"]}>
        <h2 className={styles["featured__title"]}>{t("Featured Products")}</h2>

        <ProductCarousel productList={productList} />

        <Link href={"/new-products/"} className="show__all">
          <span>{t("Showall")}</span>
        </Link>
      </div>
    </section>
  );
}

export default FeaturedProducts;
