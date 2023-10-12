import React from "react";
import styles from "@/styles/client/Cart.module.scss";
import CartProductCard from "@/lib/components/client/home/CartProductCard";
import Link from "next/link";
import { useClientStore } from "@/lib/store/clientStore";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";

interface ICartProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: ICartProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function Cart() {
  const { shoppingCart } = useClientStore();

  const subTotal = shoppingCart?.reduce(
    (prev, curr) => prev + (curr.product.mainPrice ?? 0) * curr.quantity,
    0
  );

  const subTotalWithDiscount = shoppingCart?.reduce(
    (prev, curr) =>
      prev +
      ((curr.product.mainPrice ?? 0) - (curr.product.promotionPrice ?? 0)) *
        curr.quantity,
    0
  );

  const discount = subTotal - subTotalWithDiscount;

  const grandTotal = subTotalWithDiscount;

  const { t } = useTranslation();

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
    <section className={styles["cart__section"]}>
      <div
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
        }}
      >
        <Breadcrumbs dir="ltr" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link href={breadcrumb.href} key={index}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </div>

      <div className={styles["cart__container"]}>
        {shoppingCart && shoppingCart.length > 0 ? (
          <>
            <div className={styles["cart__products"]}>
              <h2 className={styles["cart__title"]}>{t("Shopping Cart")}</h2>

              <CartProductCard />
            </div>

            <div className={styles["cart__summary__container"]}>
              <div className={styles["cart__summary"]}>
                <h2
                  className={styles["cart__summary__title"]}
                  style={{ fontWeight: "500" }}
                >
                  {t("Cart Summary")}
                </h2>

                <div className={styles["cart__summary__details"]}>
                  <div className={styles["cart__summary__price"]}>
                    <p>{t("Grand Total")}</p>
                    <p>
                      {subTotal.toFixed(2)} {t("EGP")}
                    </p>
                  </div>

                  {discount > 0 && (
                    <div className={styles["cart__summary__price"]}>
                      <p>{t("Discount")}</p>
                      <p>
                        -{discount.toFixed(2)} {t("EGP")}
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles["cart__summary__total"]}>
                  <div className={styles["cart__summary__total__price"]}>
                    <p>{t("Net Total")}</p>
                    <p>
                      {grandTotal.toFixed(2)} {t("EGP")}
                    </p>
                  </div>
                </div>

                <Link href="/checkout" className={styles["buy__btn"]}>
                  {t("Proceed To Checkout")}
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2 className={styles["cart__title"]}>{t("Shopping Cart")}</h2>

            <p className="error__text">{t("Cart is Empty")}</p>

            <Link href="/" className="btn__contained primary">
              {t("Go Home")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
