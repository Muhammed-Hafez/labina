import { IProductGet } from "@/lib/@types/Product";
import React from "react";
import { useTranslation } from "next-i18next";
import ProductCarousel from "./ProductCarousel";
import styles from "./TopSellingProducts.module.scss";
import Link from "next/link";

function TopSellingProducts({ productList }: { productList: IProductGet[] }) {
  const { t } = useTranslation();

  return (
    <section className={styles["top__products"]}>
      <div className={styles["top__container"]}>
        <h2 className={styles["top__title"]}>{t("TopSellingProducts")}</h2>

        <ProductCarousel productList={productList} />

        <Link href={"/top-selling/"} className={styles["show__all"]}>
          <span>{t("Showall")}</span>
        </Link>
      </div>
    </section>
  );
}

export default TopSellingProducts;
