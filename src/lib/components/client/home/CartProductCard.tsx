import { ICartGet } from "@/lib/@types/Cart";
import { Icon } from "@iconify/react";
import apiPaths from "@/lib/@types/enum/apiPaths";
import { useClientStore } from "@/lib/store/clientStore";
import { useEffect, useState } from "react";
import httpClient from "@/lib/middleware/httpClient";
import styles from "./CartProductCard.module.scss";
import { useRouter } from "next/router";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

const CartProductCard = () => {
  const { locale, defaultLocale } = useRouter();
  const [deletedItemId, setDeletedItemId] = useState("");
  const { t } = useTranslation();
  const { shoppingCart, setShoppingCart } = useClientStore();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await httpClient.get(apiPaths.getCart);
        // console.log(res.data.data);
        setShoppingCart(await res.data.data);
      } catch (error) {
        setShoppingCart([]);
      }
    };

    getData();
  }, []);

  function productAmountInc(cartItem: ICartGet) {
    httpClient
      .put("/cart", { product: cartItem.product._id, quantity: 1 })
      .then((res) => {
        setShoppingCart(res.data.data);
      })
      .catch((err) => {
        // console.error(err)
      });
  }

  function productAmountDec(cartItem: ICartGet) {
    httpClient
      .put("/cart/decrease", { product: cartItem.product._id, quantity: 1 })
      .then((res) => {
        setShoppingCart(res.data.data);
      })
      .catch((err) => {
        // console.error(err)
      });
  }

  function handleRemoveCartItem(cartItem: ICartGet) {
    httpClient
      .put("/cart/remove", {
        product: cartItem.product._id,
      })
      .then((res) => {
        setShoppingCart(res.data.data);
        handleClose();
      })
      .catch((err) => {
        // console.error(err)
      });
  }

  const handleClose = () => {
    setDeletedItemId("");
  };

  return (
    <>
      <Dialog
        open={deletedItemId !== ""}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-content"
      >
        <DialogTitle id="delete-modal-title">
          {t(`Are you sure to delete this Address?`)}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>{t(`Cancel`)}</Button>
          <Button onClick={() => handleRemoveCartItem}>{t(`Yes`)}</Button>
        </DialogActions>
      </Dialog>

      <section className={styles["cart__section"]}>
        {shoppingCart.map((cartItem) => (
          <div key={cartItem._id} className={styles["cart__card"]}>
            <div className={styles["card__header"]}>
              <div className={styles["card__img"]}>
                <img
                  src={
                    "/api/static/images/product/" + cartItem.product.mainImage
                  }
                  alt=""
                  style={{ aspectRatio: "1/1" }}
                />
              </div>

              <div className={styles["card__info"]}>
                <h3 className={styles["product__name"]}>
                  {getAutocompleteLabel(
                    cartItem?.product.titleList,
                    locale,
                    defaultLocale
                  )}
                </h3>
                {/* <!-- <span className="product__price">{cartItem.product.mainPrice} {t("€")}</span> --> */}

                {/* <span className={styles["product__price"]}>
                  {(cartItem.product.promotionPrice ?? 0) > 0 && (
                    <del
                      style={{
                        marginInlineEnd: "0.5rem",
                      }}
                    >
                      {+(cartItem.product.mainPrice ?? 0).toFixed(2)} {t("€")}
                    </del>
                  )}
                  {
                    +(
                      (cartItem.product.mainPrice ?? 0) -
                      (cartItem.product.promotionPrice ?? 0)
                    ).toFixed(2)
                  }{" "}
                  {t("€")}
                </span> */}
                <button
                  className={styles["remove__product"]}
                  onClick={() => handleRemoveCartItem(cartItem)}
                >
                  <Icon
                    icon="pajamas:remove"
                    className={styles["remove__icon"]}
                  />
                  {t("Remove")}
                </button>
                {/* <Link href="" className={styles["view__product"]}>
                  <Icon
                    icon="ic:baseline-remove-red-eye"
                    className={styles["view__icon"]}
                  />
                  {t("View")}
                </Link> */}
              </div>
              <div className={styles["card__footer"]}>
                <div className={styles["product__amount"]}>
                  <button
                    onClick={() => productAmountDec(cartItem)}
                    disabled={cartItem.quantity < 2}
                  >
                    -
                  </button>
                  <p className={styles["product__number"]}>
                    {cartItem.quantity}
                  </p>
                  <button onClick={() => productAmountInc(cartItem)}>+</button>
                </div>

                <div className={styles["total__price"]}>
                  {(
                    ((cartItem.product.mainPrice ?? 0) -
                      (cartItem.product.promotionPrice ?? 0)) *
                    cartItem.quantity
                  ).toFixed(2)}{" "}
                  {t("€")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default CartProductCard;
