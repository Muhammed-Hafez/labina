import { IProductGet } from "@/lib/@types/Product";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import ProductCarousel from "@/lib/components/client/home/ProductCarousel";
import httpClient, { httpClientSSR } from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "@/styles/client/ProductSlug.module.scss";
import { useTranslation } from "next-i18next";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";

interface IProductSlugProps extends ITranslate {
  product?: IProductGet;
  suggestedProductList?: IProductGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
}) => {
  let props: IProductSlugProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    suggestedProductList: [],
  };

  try {
    const res = await httpClientSSR(req).get(
      "/product/slug/" + query.product_slug
    );
    props.product = await res.data.data.product;
    props.suggestedProductList = await res.data.data.suggestedProductList;
  } catch (error) {}

  return {
    props,
  };
};

function ProductSlug(props: IProductSlugProps) {
  const { locale, defaultLocale } = useRouter();
  const { setShoppingCart } = useClientStore();
  const [productAmount, setProductAmount] = useState(1);
  const { t } = useTranslation();

  const mainOptions = {
    // direction: locale === "ar" ? "rtl" : ("ltr" as any),
    type: "loop",
    perPage: 1,
    perMove: 1,
    pagination: true,
    arrows: false,
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
  };

  const thumbsOptions = {
    // direction: locale === "ar" ? "rtl" : ("ltr" as any),
    type: "loop",
    rewind: true,
    gap: "1rem",
    arrows: false,
    perPage: 4,
    cover: true,
    focus: "center" as const,
    isNavigation: true,
    updateOnMove: true,
  };

  function productAmountInc() {
    setProductAmount((prev) => prev + 1);
  }

  function productAmountDec() {
    setProductAmount((prev) => prev - 1);
  }

  function handleAddToCart() {
    httpClient
      .put("/cart", { product: props.product?._id, quantity: productAmount })
      .then((res) => {
        console.log(res.data.data);
        setShoppingCart(res.data.data);
      })
      .catch((err) => {
        // console.log(err)
      });
  }
  const router = useRouter();
  const pathSegments = router.asPath.split("/");

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(1, index + 1).join("/")}`;
    const name = segment === "" ? "Home" : segment;

    return {
      href,
      name,
    };
  });

  return (
    <>
      <section
        className={styles["product__section"]}
        style={{ maxWidth: "1300px", marginInline: "auto" }}
      >
        <div
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
          }}
        >
          <Breadcrumbs dir="ltr" aria-label="breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => (
              <Link href={breadcrumb.href} key={breadcrumb.name}>
                {breadcrumb.name.charAt(0).toUpperCase() +
                  breadcrumb.name.slice(1).replaceAll("-", " ")}
              </Link>
            ))}
          </Breadcrumbs>
        </div>
        <div className={styles["product__container"]}>
          {props.product?.imageList && (
            <>
              <div className={styles["wrapper"]}>
                <div className={styles["main__slider"]}>
                  <h2 className={styles["product__title__mobile"]}>
                    {getAutocompleteLabel(
                      props?.product?.titleList,
                      locale,
                      defaultLocale
                    )}
                  </h2>

                  <Splide
                    options={mainOptions}
                    aria-labelledby="thumbnails-example-heading"
                  >
                    {props.product?.imageList?.map((slide) => (
                      <SplideSlide key={slide}>
                        <div className={styles["slide__img"]}>
                          <img
                            src={"/api/static/images/product/" + slide}
                            alt=""
                          />
                        </div>
                      </SplideSlide>
                    ))}
                  </Splide>
                </div>
                {/* <div className={styles["secondary__slider"]}>
                  <Splide options={thumbsOptions}>
                    {props.product?.imageList?.map((slide) => (
                      <SplideSlide
                        key={slide}
                        className={styles["secondary__slider__item"]}
                      >
                        <div className={styles["slide__img__secondary"]}>
                          <img
                            src={"/api/static/images/product/" + slide}
                            alt=""
                          />
                        </div>
                      </SplideSlide>
                    ))}
                  </Splide>
                </div> */}
              </div>
            </>
          )}
          <div className={styles["product__details"]}>
            <div className={styles["product__info"]}>
              <h2>
                {getAutocompleteLabel(
                  props?.product?.titleList,
                  locale,
                  defaultLocale
                )}
              </h2>
              <h5>
                {getAutocompleteLabel(
                  props?.product?.category.titleList,
                  locale,
                  defaultLocale
                )}
              </h5>
              <p>
                {getAutocompleteLabel(
                  props?.product?.descriptionList,
                  locale,
                  defaultLocale
                )}
              </p>
            </div>

            <div className={styles["product__price"]}>
              <span>
                {(props.product?.promotionPrice ?? 0) > 0 && (
                  <del>
                    {props.product?.mainPrice.toFixed(2)} {t("€")}
                  </del>
                )}
                <br />
                {(
                  (props?.product?.mainPrice ?? 0) -
                  (props?.product?.promotionPrice ?? 0)
                ).toFixed(2)}{" "}
                {t("€")}
              </span>
            </div>

            <div className={styles["product__actions"]}>
              <div className={styles["product__amount"]}>
                <button onClick={productAmountDec} disabled={productAmount < 2}>
                  -
                </button>
                <p className={styles["product__number"]}>{productAmount}</p>
                <button onClick={productAmountInc}>+</button>
              </div>
              <div className={styles["product__btns"]}>
                <button
                  className={styles["add__btn"]}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  {t("Add To Cart")}
                </button>

                <button className={styles["wishlist__btn"]} disabled>
                  {t("Wishlist")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {props?.product?.relatedList && props.product.relatedList.length > 0 && (
        <div className={styles["related__products"]}>
          <h3>{t("Related Products")}</h3>
          <ProductCarousel productList={props?.product?.relatedList} />
        </div>
      )}

      {props?.suggestedProductList && props.suggestedProductList.length > 0 && (
        <div className={styles["suggested__products"]}>
          <h3>{t("You may also like")}</h3>
          <ProductCarousel productList={props?.suggestedProductList} />
        </div>
      )}
    </>
  );
}

export default ProductSlug;
