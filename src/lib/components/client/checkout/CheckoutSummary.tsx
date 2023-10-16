import React from "react";
import styles from "./CheckoutSummary.module.scss";
import { ICouponPost } from "@/lib/@types/Coupon";
import { useClientStore } from "@/lib/store/clientStore";
import { useTranslation } from "next-i18next";

function CheckoutSummary({
  shippingValue,
  coupon,
}: {
  shippingValue?: number;
  coupon?: ICouponPost;
}) {
  const { t } = useTranslation();
  const { shoppingCart } = useClientStore();

  const couponValue = coupon
    ? shoppingCart.reduce((prev, curr) => {
        let val = 0;

        if (
          coupon &&
          (coupon.type === "all" ||
            (coupon.type === "product" &&
              curr.product._id &&
              coupon.productList?.includes(curr.product._id)) ||
            (coupon.type === "category" &&
              coupon?.categoryList?.includes(curr.product.category as any)))
        ) {
          val = coupon.value
            ? coupon.isPercentage
              ? (((curr.product.mainPrice ?? 0) -
                  (curr.product.promotionPrice ?? 0)) *
                  curr.quantity *
                  coupon.value) /
                100
              : Math.min(
                  ((curr.product.mainPrice ?? 0) -
                    (curr.product.promotionPrice ?? 0)) *
                    curr.quantity,
                  coupon.value
                )
            : 0;
        }

        return prev + val;
      }, 0)
    : 0;

  const subTotal = shoppingCart.reduce(
    (prev, curr) => prev + (curr.product.mainPrice ?? 0) * curr.quantity,
    0
  );

  const subTotalWithDiscount = shoppingCart.reduce(
    (prev, curr) =>
      prev +
      ((curr.product.mainPrice ?? 0) - (curr.product.promotionPrice ?? 0)) *
        curr.quantity,
    0
  );

  const discount = subTotal - subTotalWithDiscount;

  const couponActualValue =
    coupon?.minCartValue !== undefined &&
    subTotalWithDiscount > coupon.minCartValue
      ? coupon?.isPercentage
        ? coupon?.maxDiscountValue !== undefined && coupon.maxDiscountValue > 0
          ? Math.min(couponValue, coupon.maxDiscountValue)
          : couponValue
        : Math.min(couponValue, coupon?.value ?? Number.MAX_VALUE)
      : 0;

  const total = subTotalWithDiscount + (shippingValue ?? 0) - couponActualValue;

  return (
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
              {subTotal.toFixed(2)} {t("€")}
            </p>
          </div>

          {discount > 0 && (
            <>
              <div
                className={styles["cart__summary__price"]}
                style={{
                  borderBottom: "1px solid #c9c9c9",
                  paddingBottom: "0.5rem",
                }}
              >
                <p>{t("Discount")}</p>
                <p>
                  - {discount.toFixed(2)} {t("€")}
                </p>
              </div>

              <div className={styles["cart__summary__price"]}>
                <p>{t("Total after discount")}</p>
                <p>
                  {subTotalWithDiscount.toFixed(2)} {t("€")}
                </p>
              </div>
            </>
          )}

          {couponActualValue > 0 && (
            <div className={styles["cart__summary__price"]}>
              <p>{t("Coupon Discount")}</p>
              <p>
                - {couponActualValue.toFixed(2)} {t("€")}
              </p>
            </div>
          )}
          <div className={styles["cart__summary__price"]}>
            <p>{t("Delivery Charges")}</p>
            {shippingValue !== undefined && (
              <p>
                + {shippingValue.toFixed(2)} {t("€")}
              </p>
            )}
          </div>
        </div>

        {total && (
          <div className={styles["cart__summary__total"]}>
            <div className={styles["cart__summary__total__price"]}>
              <p>{t("Net Total")}</p>
              <p>
                {total.toFixed(2)} {t("€")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutSummary;
