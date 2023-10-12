import { IProductGet } from "@/lib/@types/Product";
import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./New Products.module.scss";
import ProductCard from "./ProductCard";
import Pagination from "@mui/material/Pagination";

function TopSellingProducts({ productList }: { productList: IProductGet[] }) {
  const { t } = useTranslation();

  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderedItems = productList.slice((page - 1) * 20, page * 20);

  return (
    <section className={styles["new__products"]}>
      <div className={styles["new__container"]}>
        <h2 className={styles["new__title"]}>{t("Top Selling Products")}</h2>

        <ProductCard productList={renderedItems} />

        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={Math.ceil(productList.length / 20)}
            page={page}
            onChange={handleChange}
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </section>
  );
}

export default TopSellingProducts;
