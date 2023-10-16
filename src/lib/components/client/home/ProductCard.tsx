import { IProductGet } from "@/lib/@types/Product";
import httpClient from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";

import styles from "./ProductCard.module.scss";

function ProductCard({ productList }: { productList: IProductGet[] }) {
  const { locale, defaultLocale } = useRouter();
  const { setShoppingCart } = useClientStore();
  const { t } = useTranslation();

  function addToCart(id: string) {
    httpClient
      .put("/cart", { product: id, quantity: 1 })
      .then((res) => {
        // console.log(res.data.data);
        setShoppingCart(res.data.data);
      })
      .catch((err) => {
        // console.log(err)
      });
  }

  return (
    <section className={styles.product__card__wrapper}>
      {productList.map((product) => {
        return (
          <div
            className="product__card__container"
            style={{ width: "200px" }}
            key={product._id}
          >
            <Link className="product__card" href={"/product/" + product.slug}>
              <div className="product__img">
                <img
                  src={"/api/static/images/product/" + product.mainImage}
                  alt=""
                />
              </div>

              <div className="product__details">
                <h3 className="product__name">
                  {product?.titleList?.find((x) => x.lang === locale)?.value ||
                    product?.titleList?.find((x) => x.lang === defaultLocale)
                      ?.value ||
                    ""}
                </h3>
                <p className="product__desc">
                  {product.descriptionList?.find((x) => x.lang === locale)
                    ?.value ||
                    product.descriptionList?.find(
                      (x) => x.lang === defaultLocale
                    )?.value ||
                    ""}
                </p>
                <span className="product__price">
                  {(product.promotionPrice ?? 0) > 0 && (
                    <del
                      style={{
                        marginInlineEnd: "0.5rem",
                      }}
                    >
                      {product.mainPrice.toFixed(2)} {t("€")}
                    </del>
                  )}
                  <br />
                  {(product.mainPrice - (product.promotionPrice ?? 0)).toFixed(
                    2
                  )}{" "}
                  {t("€")}
                </span>

                {product.isNewProduct ? (
                  <div className="product__badge__new">{t("New!")}</div>
                ) : (
                  product.promotionPrice && (
                    <div className="product__badge__promotion">
                      {(
                        (product.promotionPrice * 100) /
                        (product.mainPrice || 1)
                      ).toFixed(2)}
                      % OFF
                    </div>
                  )
                )}
              </div>
            </Link>
            <div className="add__container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id);
                }}
                className="add__product"
              >
                {t("Add To Cart")}
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default ProductCard;
