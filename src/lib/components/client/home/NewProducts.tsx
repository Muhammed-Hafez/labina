import { IProductGet } from "@/lib/@types/Product";
import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./NewProducts.module.scss";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

function NewProducts({ productList }: { productList: IProductGet[] }) {
  const { t } = useTranslation();

  return (
    <section className={styles["new__products"]}>
      <div className={styles["new__container"]}>
        <h2 className={styles["new__title"]}>{t("New Products")}</h2>

        <ProductCarousel productList={productList} />

        <Link href={"/new-products/"} className="show__all">
          <span>{t("Showall")}</span>
        </Link>
      </div>
    </section>
  );
}

export default NewProducts;
