"use client";

import "@splidejs/react-splide/css/core";
import { IProductGet } from "@/lib/@types/Product";
import httpClient from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./ProductCarousel.module.scss";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useTranslation } from "next-i18next";

function ProductCarousel({ productList }: { productList: IProductGet[] }) {
  const { locale, defaultLocale, query } = useRouter();
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

  const [currentPage, setCurrentPage] = useState<number>(+(query.page ?? 1));
  const [filteredData, setFilteredData] = useState<IProductGet[]>([]);
  const slicedData = filteredData?.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  return (
    <div className={styles["product__container"]}>
      <Splide
        options={{
          // direction: locale === "ar" ? "rtl" : "ltr",
          arrows: false,
          rewind: true,
          type: "loop",
          autoplay: true,
          perPage: 5,
          mediaQuery: "max",
          pagination: false,
          padding: "5rem",
          autoWidth: true,
          // focus: "center",
          breakpoints: {
            320: {
              perPage: 1,
            },
            576: {
              perPage: 1,
            },
            768: {
              perPage: 2,
            },
            992: {
              perPage: 3,
            },
            1200: {
              perPage: 4,
            },
          },
        }}
      >
        {productList.map((product) => (
          <SplideSlide key={product._id}>
            <div className="product__card__container">
              <Link className="product__card" href={"/product/" + product.slug}>
                <div className="product__img">
                  <img
                    src={"/api/static/images/product/" + product.mainImage}
                    alt=""
                  />
                </div>

                <div className="product__details">
                  <h3 className="product__name">
                    {product?.titleList?.find((x) => x.lang === locale)
                      ?.value ||
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
                        {product.mainPrice.toFixed(2)} {t("EGP")}
                      </del>
                    )}
                    <br />
                    {(
                      product.mainPrice - (product.promotionPrice ?? 0)
                    ).toFixed(2)}{" "}
                    {t("EGP")}
                  </span>
                </div>

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
          </SplideSlide>
        ))}

        {/* {productList.map((product) => (
          <SplideSlide key={product._id}>
            <ProductCard productList={productList} />
          </SplideSlide>
        ))}  */}
        {/* <ProductCard productList={productList} /> */}
      </Splide>
    </div>
  );
}

export default ProductCarousel;
